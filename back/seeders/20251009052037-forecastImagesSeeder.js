/**
 * @file seerders/20251009052037-forecastImagesSeeder.js
 * @description forecastImagesSeeder 시더 파일
 * 251009 v1.0 meerkat
 */

import dayjs from 'dayjs';
import db from '../db_index.js';
import { getAllForecast } from '../repositories/Forecast.repository copy.js';
import { informCodeList } from '../configs/fieldParams.config.js';
const {sequelize} = db;

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    const INFORM_CODE_LIST = informCodeList;
    const IMAGE_INFORM_CODE_LIST = ['PM10', 'PM2P5', 'O3'];
    const IMAGE_CUT_NAME_LIST = ['gif_0', 'gif_6', 'gif_12'];
    const LAST_INFORM_HOUR = 23;

    const MAX_ROW_CNT = 30000; // 메모리릭 방지 max 카운트
    let cnt = 0; // 메모리릭 방지 카운트
    let accCnt = 0; // 누적 카운트
    let resultData = [];

    // 통보정보 획득
    const resultForecasts = await getAllForecast();

    for await (const forecast of resultForecasts) {
      cnt += 9;
      const targetDate = dayjs(forecast.dataTime);

      // fileDate 규칙 : [5, 11, 17] = 1일 전 일자, [23] = 당일 일자
      const fileDate = targetDate.get('hour') < LAST_INFORM_HOUR ? targetDate.subtract(1, 'day').format('YYYYMMDD') : targetDate.format('YYYYMMDD');

      // PM10 파일명
      // https://airkorea.or.kr/dustImage/2025/01/01/17/09km/AQF.20241231.NIER_09_01.PM10.2days.ani.gif
      // https://airkorea.or.kr/dustImage/2025/01/01/17/09km/AQF.20241231.NIER_09_01.PM10.2days.ani.gif_0.gif
      // PM25 파일명
      // https://airkorea.or.kr/dustImage/2025/01/01/17/09km/AQF.20241231.NIER_09_01.PM2P5.2days.ani.gif
      // https://airkorea.or.kr/dustImage/2025/01/01/17/09km/AQF.20241231.NIER_09_01.PM2P5.2days.ani.gif_0.gif
      // O3 파일명 (04-01 ~ 10-31)
      // https://airkorea.or.kr/dustImage/2025/04/01/17/09km/AQF.20250331.NIER_09_01.O3.2days.ani.gif
      // https://airkorea.or.kr/dustImage/2025/04/01/17/09km/AQF.20250331.NIER_09_01.O3.2days.ani.gif_0.gif
      const baseFilePath = `/${targetDate.format('YYYY')}/${targetDate.format('MM')}/${targetDate.format('DD')}/${targetDate.format('HH')}/09km`;
      const animationFile1 = forecast.informCode ===  INFORM_CODE_LIST[0] ? `${baseFilePath}/AQF.${fileDate}.NIER_09_01.${IMAGE_INFORM_CODE_LIST[0]}.2days.ani.gif` : '';
      const animationFile2 = forecast.informCode ===  INFORM_CODE_LIST[1] ? `${baseFilePath}/AQF.${fileDate}.NIER_09_01.${IMAGE_INFORM_CODE_LIST[1]}.2days.ani.gif` : '';
      const animationFile3 = forecast.informCode ===  INFORM_CODE_LIST[2] ? `${baseFilePath}/AQF.${fileDate}.NIER_09_01.${IMAGE_INFORM_CODE_LIST[2]}.2days.ani.gif` : '';
      const cutFile1 = forecast.informCode ===  INFORM_CODE_LIST[0] ? `${baseFilePath}/AQF.${fileDate}.NIER_09_01.${IMAGE_INFORM_CODE_LIST[0]}.2days.ani.${IMAGE_CUT_NAME_LIST[0]}.gif` : '';
      const cutFile2 = forecast.informCode ===  INFORM_CODE_LIST[0] ? `${baseFilePath}/AQF.${fileDate}.NIER_09_01.${IMAGE_INFORM_CODE_LIST[0]}.2days.ani.${IMAGE_CUT_NAME_LIST[1]}.gif` : '';
      const cutFile3 = forecast.informCode ===  INFORM_CODE_LIST[0] ? `${baseFilePath}/AQF.${fileDate}.NIER_09_01.${IMAGE_INFORM_CODE_LIST[0]}.2days.ani.${IMAGE_CUT_NAME_LIST[2]}.gif` : '';
      const cutFile4 = forecast.informCode ===  INFORM_CODE_LIST[0] || forecast.informCode ===  INFORM_CODE_LIST[1] ? `${baseFilePath}/AQF.${fileDate}.NIER_09_01.${IMAGE_INFORM_CODE_LIST[1]}.2days.ani.${IMAGE_CUT_NAME_LIST[0]}.gif` : '';
      const cutFile5 = forecast.informCode ===  INFORM_CODE_LIST[0] || forecast.informCode ===  INFORM_CODE_LIST[1] ? `${baseFilePath}/AQF.${fileDate}.NIER_09_01.${IMAGE_INFORM_CODE_LIST[1]}.2days.ani.${IMAGE_CUT_NAME_LIST[1]}.gif` : '';
      const cutFile6 = forecast.informCode ===  INFORM_CODE_LIST[0] || forecast.informCode ===  INFORM_CODE_LIST[1] ? `${baseFilePath}/AQF.${fileDate}.NIER_09_01.${IMAGE_INFORM_CODE_LIST[1]}.2days.ani.${IMAGE_CUT_NAME_LIST[2]}.gif` : '';
      
      resultData.push(generateDataForecastImage([forecast.id, cutFile1], 1));
      resultData.push(generateDataForecastImage([forecast.id, cutFile2], 2));
      resultData.push(generateDataForecastImage([forecast.id, cutFile3], 3));
      resultData.push(generateDataForecastImage([forecast.id, cutFile4], 4));
      resultData.push(generateDataForecastImage([forecast.id, cutFile5], 5));
      resultData.push(generateDataForecastImage([forecast.id, cutFile6], 6));
      resultData.push(generateDataForecastImage([forecast.id, animationFile1], 7));
      resultData.push(generateDataForecastImage([forecast.id, animationFile2], 8));
      resultData.push(generateDataForecastImage([forecast.id, animationFile3], 9));

      // Row 데이터 Insert
      if(cnt >= MAX_ROW_CNT) {
        accCnt += cnt;
        console.log(`MaxRow Data Insert [${cnt} / ${accCnt}]`);
        await queryInterface.bulkInsert('forecast_images', resultData, {});
        cnt = 0;
        resultData = [];
      }
    }

    // 남은 데이터 Insert
    if(resultData.length > 0) {
      accCnt += cnt;
      console.log(`Leftover Data Insert [${cnt} / ${accCnt}]`);
      await queryInterface.bulkInsert('forecast_images', resultData);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('forecast_images', null, {});
  }
};

function generateDataForecastImage(data, position) {
  const [forecastId, url] = data;

  return {
    forecast_id: forecastId,
    position: position,
    image_url: url,
    created_at: new Date(),
    updated_at: new Date(),
  }
}