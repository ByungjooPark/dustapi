/**
 * @file seerders/20251003102859-observationsSeeder.js
 * @description observationsSeeder 시더 파일
 * 251007 v1.0 meerkat
 */

'use strict';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { dateFormatToYYYYMMDDHHmiSSWith24HourToNextDay00Hour } from '../utils/dateFormatter.util.js';
import { calculationAvgValue, generateCAIInfo, generateGradeInfoCo, generateGradeInfoNo2, generateGradeInfoO3, generateGradeInfoPm10, generateGradeInfoPm25, generateGradeInfoSo2 } from '../utils/calcuratorCAI.util.js';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    try {
      const maxRowCnt = 30000; // 메모리릭 방지 max 카운트
      const baseDir = path.resolve('seeders/base/confirmed');
      console.log(`Get File List [${baseDir}]`);
      const files = fs.readdirSync(baseDir);
      
      for await(const fileName of files) {
        // TODO : 개발 테스트용 코드
        // if(!fileName.includes('test.txt')) {
        //   continue;
        // }

        let cnt = 0; // 메모리릭 방지 카운트
        let accCnt = 0;
        let resultData = [];
        let execStation = '';
        let pmAvgList = {pm10AvgList: [], pm25AvgList: []};
        const filePath = path.resolve(`${baseDir}/${fileName}`);
        
        console.log(`Start Insert File [${filePath}]`);

        const stream = fs.createReadStream(filePath);
        const reader = readline.createInterface({
          input: stream,
          crlfDelay: Infinity
        });
        
        for await(const line of reader) {
          // 공백 또는 빈 줄 건너뛰기
          if (!line.trim()) {
            continue;
          }

          cnt++;
          const lineArr = line.split('\t');
          const [stationCode, dataTime, so2Value = '', coValue = '', o3Value = '', no2Value = '', pm10Value = '', pm25Value = ''] = lineArr;

          try {
  
            // pm 하루 예측치 계산용 초기화
            if(execStation === '') {
              execStation = stationCode;
            }
            
            if(execStation !== stationCode) {
              execStation = stationCode;
              pmAvgList.pm10AvgList = [];
              pmAvgList.pm25AvgList = [];
            }
            
            if(pm10Value) {
              pmAvgList.pm10AvgList.push(pm10Value);
            }
            if(pm25Value) {
              pmAvgList.pm25AvgList.push(pm25Value);
            }
  
            // Row 데이터 생성
            resultData.push(generateDataObject(lineArr, pmAvgList));
  
            if(cnt >= maxRowCnt) {
              accCnt += cnt;
              console.log(`MaxRow Data Insert [${cnt} / ${accCnt}]`);
              await queryInterface.bulkInsert('observations', resultData);
              cnt = 0;
              resultData = [];
            }
          } catch(e) {
            console.error(cnt, line, lineArr, resultData[cnt - 2]);
            throw e;
          }
        }

        // 남은 데이터 Insert
        if(resultData.length > 0) {
          accCnt += cnt;
          console.log(`Leftover Data Insert [${cnt} / ${accCnt}]`);
          await queryInterface.bulkInsert('observations', resultData);
        }
      }
    } catch(error) {
      console.log(error);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('observations', null, {});
  }
};

function generateDataObject(lineArr, pmAvgList) {
  const [stationCode, dataTime, so2Value = '', coValue = '', o3Value = '', no2Value = '', pm10Value = '', pm25Value = ''] = lineArr;
  const dateTimeFormat = dateFormatToYYYYMMDDHHmiSSWith24HourToNextDay00Hour(dataTime);
  const {pm10AvgList, pm25AvgList} = pmAvgList;
  const pm10Avg = calculationAvgValue(pm10AvgList);
  const pm25Avg = calculationAvgValue(pm25AvgList);
  const date = new Date();
  const so2GradeInfo = generateGradeInfoSo2(so2Value);
  const coGradeInfo = generateGradeInfoCo(coValue);
  const o3GradeInfo = generateGradeInfoO3(o3Value);
  const no2GradeInfo = generateGradeInfoNo2(no2Value);
  const pm10GradeInfo = generateGradeInfoPm10(pm10Value);
  const pm25GradeInfo = generateGradeInfoPm25(pm25Value);
  const pm10AvgGradeInfo = generateGradeInfoPm10(pm10Avg);
  const pm25AvgGradeInfo = generateGradeInfoPm25(pm25Avg);
  const caiInfo = generateCAIInfo(so2GradeInfo, coGradeInfo, o3GradeInfo, no2GradeInfo, pm10GradeInfo, pm25GradeInfo);

  return {
    station_code: stationCode,
    data_time: dateTimeFormat,
    so2_value: so2Value,
    co_value: coValue,
    o3_value: o3Value,
    no2_value: no2Value,
    pm10_value: pm10Value,
    pm10_value_24: pm10Avg ? pm10Avg.toString() : '',
    pm25_value: pm25Value,
    pm25_value_24: pm25Avg ? pm25Avg.toString() : '',
    khai_value: caiInfo.cai > 0 ? caiInfo.cai.toString() : '',
    khai_code: caiInfo.code,
    khai_grade: caiInfo.cai > 0 ? caiInfo.grade.toString(): '',
    so2_grade: so2GradeInfo ? so2GradeInfo.grade.toString() : '',
    co_grade: coGradeInfo ? coGradeInfo.grade.toString() : '',
    o3_grade: o3GradeInfo ? o3GradeInfo.grade.toString() : '',
    no2_grade: no2GradeInfo ? no2GradeInfo.grade.toString() : '',
    pm10_grade: pm10AvgGradeInfo ? pm10AvgGradeInfo.grade.toString() : '',
    pm25_grade: pm25AvgGradeInfo ? pm25AvgGradeInfo.grade.toString() : '',
    pm10_grade_1h: pm10GradeInfo ? pm10GradeInfo.grade.toString() : '',
    pm25_grade_1h: pm25GradeInfo ? pm25GradeInfo.grade.toString() : '',
    so2_flag: so2GradeInfo ? '' : '자료이상',
    co_flag: coGradeInfo ? '' : '자료이상',
    o3_flag: o3GradeInfo ? '' : '자료이상',
    no2_flag: no2GradeInfo ? '' : '자료이상',
    pm10_flag: pm10GradeInfo ? '' : '자료이상',
    pm25_flag: pm25GradeInfo ? '' : '자료이상',
    created_at: date,
    updated_at: date
  }
}