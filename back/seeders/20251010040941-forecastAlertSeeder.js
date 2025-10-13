/**
 * @file seerders/20251010040941-forecastAlertSeeder.js.js
 * @description 미세먼지 경보 발령 데이터 생성
 * 251010 v1.0 meerkat
 */

import path from 'path';
import fs from 'fs';
import readline from 'readline';
import { getAllLocations } from '../repositories/location.repository.js';
import { informCodeList } from '../configs/fieldParams.config.js';
import dayjs from 'dayjs';
import { averageToDateByLocation } from '../repositories/observation.repository.js';
import { subDecimalPlace } from '../utils/dataFormatter.util.js';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    // 지역	권역	경보단계	발령시간	해제시간
    const DIR_PATH = path.resolve('seeders/base/alert');
    const FILE_EXTENSION = 'txt';
    const INFORM_CODE_LIST = informCodeList;
    const MAX_ROW_CNT = 30000; // 메모리릭 방지 max 카운트
    let cnt = 0; // 메모리릭 방지 카운트
    let accCnt = 0;
    let resultData = [];
    let snCnt = 0; // sn 컬럼 값 지정
    const locations = await getAllLocations();
    
    for await (const informCode of INFORM_CODE_LIST) {
      console.log(`---- ${informCode} Processing Start ----`);
      const stream = fs.createReadStream(`${DIR_PATH}/${informCode}.${FILE_EXTENSION}`);
      const reader = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
      });

      for await (const line of reader) {
        cnt++;
        snCnt++;
        let id = 0;
        let issueGbn = '';
        let issueVal = '';
        let clearVal = '';
        let issueDate = null;
        let clearDate = null;

        // 공백 또는 빈 줄 건너뛰기
        let trimLine = line.trim();
        if (!trimLine) {
          continue;
        }
        
        let [lineDistrictName, lineMoveName, lineIssueGbn, lineIssueDate, lineClearDate] = trimLine.split('\t');
        issueGbn = lineIssueGbn;
        issueDate = dayjs(lineIssueDate, 'YYYY-MM-DD HH').add(1, 'year');
        clearDate = dayjs(lineClearDate, 'YYYY-MM-DD HH').add(1, 'year');
        let getLocation = locations.filter(location => {
          return location.districtName === lineDistrictName;
        });

        if(getLocation.length === 0) {
          console.log(`Not Location 1: ${trimLine}`);
          continue;
        }
        
        if(getLocation.length === 1) {
          id = getLocation[0].id;
          // 가공 데이터 저장
        } else if(getLocation.length >= 2) {
          for await (const location of getLocation) {
            if(location.moveName.includes(lineMoveName)) {
              id = location.id;
              break;
            } else if(location.regionName.includes(lineMoveName)) {
              id = location.id;
              break;
            }

            let splitLineMoveName = lineMoveName.split(' ');
            if(location.moveName.includes(splitLineMoveName[0])) {
              id = location.id;
              break;
            } else if(location.regionName.includes(splitLineMoveName[0])) {
              id = location.id;
              break;
            }
          }

          if(id === 0) {
            console.log(`Not Location 2: ${trimLine}`);
            continue;
          }
        }

        let params = {
          locId: id,
          startDate: issueDate.format('YYYY-MM-DD HH:mm:ss'),
          endDate: clearDate.format('YYYY-MM-DD HH:mm:ss')
        };

        // 발령일, 발령종료일 평균 오염지수 획득
        let resultAverageToDateByLocation = await averageToDateByLocation(null, params);
        
        if(informCode === INFORM_CODE_LIST[0] ) {
          issueVal = Math.round(resultAverageToDateByLocation[0].avgPm10);
          clearVal = Math.round(resultAverageToDateByLocation[1].avgPm10);
        } else if(informCode === INFORM_CODE_LIST[1] ) {
          issueVal = Math.round(resultAverageToDateByLocation[0].avgPm25);
          clearVal = Math.round(resultAverageToDateByLocation[1].avgPm25);
        } else {
          issueVal = subDecimalPlace(resultAverageToDateByLocation[0].avgO3, 4);
          clearVal = subDecimalPlace(resultAverageToDateByLocation[1].avgO3, 4);
        }
        
        resultData.push(generateDataForecastAlert([snCnt, id, informCode, issueGbn, issueDate, issueVal, clearDate, clearVal]));

        // Row 데이터 Insert
        if(cnt >= MAX_ROW_CNT) {
          accCnt += cnt;
          console.log(`MaxRow Data Insert [${cnt} / ${accCnt}]`);
          await queryInterface.bulkInsert('forecast_alerts', resultData, {});
          cnt = 0;
          resultData = [];
        }
      }

      // 남은 데이터 Insert
      if(resultData.length > 0) {
        accCnt += cnt;
        console.log(`Leftover Data Insert [${cnt} / ${accCnt}]`);
        await queryInterface.bulkInsert('forecast_alerts', resultData, {});
        cnt = 0;
        accCnt = 0;
        resultData = [];
      }
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('forecast_alerts', null, {});
  }
};


function generateDataForecastAlert(data) {
  const [sn, locationId, itemCode, issueGbn, issueDate, issueVal, clearDate, clearVal] = data;

  return {
    sn: sn,
    data_date: issueDate.format('YYYY-MM-DD HH:mm:ss'),
    location_id: locationId,
    item_code: itemCode,
    issue_gbn: issueGbn,
    issue_date: issueDate.format('YYYY-MM-DD HH:mm:ss'),
    issue_val: issueVal.toString(),
    clear_date: clearDate.format('YYYY-MM-DD HH:mm:ss'),
    clear_val: clearVal.toString(),
    created_at: issueDate.format('YYYY-MM-DD HH:mm:ss'),
    updated_at: issueDate.format('YYYY-MM-DD HH:mm:ss'),
  };
}