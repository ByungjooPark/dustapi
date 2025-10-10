/**
 * @file seerders/20251009032037-forecastsSeeder.js
 * @description forecastsSeeder 시더 파일
 * 251009 v1.0 meerkat
 */

import dayjs from 'dayjs';
import db from '../db_index.js';
import { informCodeList } from '../configs/fieldParams.config.js';
import { convertGradeToKorean, generateGradeInfoO3, generateGradeInfoPm10, generateGradeInfoPm25 } from '../utils/calcuratorCAI.util.js';
import { averageToDateByDistrict } from '../repositories/Observation.repository.js';
const {sequelize} = db;

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    const START_DATE = dayjs('2025-01-01 00:00:00');
    const END_DATE = dayjs('2025-12-31 23:59:59');
    const O3_START_DATE = dayjs('2025-04-01 00:00:00');
    const O3_END_DATE = dayjs('2025-10-31 23:59:59');
    let dataTime = START_DATE.clone().add(5, 'hour');
    const INFORM_TERM = 6;
    const [INFORE_CODE_PM10, INFORE_CODE_PM25, INFORE_CODE_O3] = informCodeList;
    
    const MAX_ROW_CNT = 30000; // 메모리릭 방지 max 카운트
    let cnt = 0; // 메모리릭 방지 카운트
    let accCnt = 0; // 누적 카운트
    let resultData = [];

    while(dataTime.isBefore(END_DATE, 'day')) {
      // 시간 초기화
      const informDate = dataTime.startOf('day');
      const targetDate = informDate.add(1, 'day');
      const startDate = targetDate.format('YYYY-MM-DD HH:mm:ss');
      const endDate = targetDate.format('YYYY-MM-DD HH:mm:ss');
      const o3Flg = (informDate.isAfter(O3_START_DATE, 'day') || informDate.isSame(O3_START_DATE, 'day')) && informDate.isBefore(O3_END_DATE, 'day');

      // 데이터 초기화
      const gradeInfoPm10List = [];
      const gradeInfoPm25List = [];
      const gradeInfoO3List = [];
      const informCodeInfo = {
        pm10: {
          code: INFORE_CODE_PM10,
          title: '○ [미세먼지]',
          gradeCnt: [[], [], [], [], []], // (idx 0은 미사용)
        },
        pm25: {
          code: INFORE_CODE_PM25,
          title: '○ [초미세먼지]',
          gradeCnt: [[], [], [], [], []], // (idx 0은 미사용)
        },
        o3: {
          code: INFORE_CODE_O3,
          title: '○ [오존]',
          gradeCnt: [[], [], [], [], []], // (idx 0은 미사용)
        }
      }

      // 지역별 오염물질 지수 평균 획득
      const result = await averageToDateByDistrict(null, {startDate, endDate});
      
      // 데이터 가공 처리
      for await (const item of result) {
        const gradeInfoPm10 = generateGradeInfoPm10(item.avgPm10);
        informCodeInfo.pm10.gradeCnt[gradeInfoPm10.grade].push(item.sidoName);
        gradeInfoPm10List.push(`${item.sidoName} : ${convertGradeToKorean(gradeInfoPm10.grade)}`);

        const gradeInfoPm25 = generateGradeInfoPm25(item.avgPm25);
        informCodeInfo.pm25.gradeCnt[gradeInfoPm25.grade].push(item.sidoName);
        gradeInfoPm25List.push(`${item.sidoName} : ${convertGradeToKorean(gradeInfoPm25.grade)}`);

        if(o3Flg) {
          const gradeInfoO3 = generateGradeInfoO3(item.avgO3);
          informCodeInfo.o3.gradeCnt[gradeInfoO3.grade].push(item.sidoName);
          gradeInfoO3List.push(`${item.sidoName} : ${convertGradeToKorean(gradeInfoO3.grade)}`);
        }
      }

      // 삽입 데이터 객체 생성

      const informOverallPm10 = generateInformOverall(informCodeInfo.pm10.gradeCnt, informCodeInfo.pm10.title);
      const informCausePm10 = generateInformCause(informCodeInfo.pm10.gradeCnt, informCodeInfo.pm10.title);
      resultData.push(generateDataForecast([dataTime, INFORE_CODE_PM10, informOverallPm10, informCausePm10, gradeInfoPm10List, '', targetDate]));
      cnt++;

      const informOverallPm25 = generateInformOverall(informCodeInfo.pm25.gradeCnt, informCodeInfo.pm25.title);
      const informCausePm25 = generateInformCause(informCodeInfo.pm25.gradeCnt, informCodeInfo.pm25.title);
      resultData.push(generateDataForecast([dataTime, INFORE_CODE_PM25, informOverallPm25, informCausePm25, gradeInfoPm25List, '', targetDate]));
      cnt++

      if(o3Flg) {
        const informOverallO3 = generateInformOverall(informCodeInfo.o3.gradeCnt, informCodeInfo.o3.title);
        const informCauseO3 = generateInformCause(informCodeInfo.o3.gradeCnt, informCodeInfo.o3.title);
        resultData.push(generateDataForecast([dataTime, INFORE_CODE_O3, informOverallO3, informCauseO3, gradeInfoO3List, '', targetDate]));
        cnt++;
      }

      // Row 데이터 Insert
      if(cnt >= MAX_ROW_CNT) {
        accCnt += cnt;
        console.log(`MaxRow Data Insert [${cnt} / ${accCnt}]`);
        await queryInterface.bulkInsert('forecasts', resultData, {});
        cnt = 0;
        resultData = [];
      }

      dataTime = dataTime.add(INFORM_TERM, 'hour');
    }

    // 남은 데이터 Insert
    if(resultData.length > 0) {
      accCnt += cnt;
      console.log(`Leftover Data Insert [${cnt} / ${accCnt}]`);
      await queryInterface.bulkInsert('forecasts', resultData);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('forecasts', null, {});
  }
};

function generateInformOverall(data, title = '') {
  try {
    let informOverallStr = `${title}`;
    let subStr = [];
    let higherGrade = 1;
    let higherCnt = 0;
  
    const gradeKinds = data.map((item, idx) => {
      return {
        grade: idx,
        cnt: item.length
      }
    });
    
    for(const item of gradeKinds) {
      if(item.cnt > higherCnt) {
        higherGrade = item.grade;
        higherCnt = item.cnt;
        break;
      }
    }

    const overHalfCntGrade = gradeKinds.filter(item => item.cnt > 8);
    const gradeKindsCntOverZero = gradeKinds.filter(item => item.cnt > 0);
    const gradeKindsCntOverZeroLength = gradeKindsCntOverZero.length;
  
    // 지역 절반 이상 같은 오염지수 통계가 있을 경우
    if(gradeKindsCntOverZeroLength > 2 && overHalfCntGrade.length > 0) {
      subStr.push(`대체로 '${convertGradeToKorean(overHalfCntGrade[0].grade)}'`);
    }
    
    // 나머지 처리
    if(gradeKindsCntOverZeroLength > 1) {
      subStr.push(`'${convertGradeToKorean(gradeKindsCntOverZero[0].grade)}'~'${convertGradeToKorean(gradeKindsCntOverZero[gradeKindsCntOverZeroLength - 1].grade)}'`);
    } else {
      subStr.push(`'${convertGradeToKorean(gradeKindsCntOverZero[0].grade)}'`);
    }
  
    // informOverallStr 작성
    if(subStr.length > 1) {
      informOverallStr = `${informOverallStr} ${subStr.join(', 곳에 따라 ')}으로 예상됩니다.`;
    } else {
      informOverallStr = `${informOverallStr} 전 권역이 ${subStr.join('')}으로 예상됩니다.`;
    }
  
    return informOverallStr;
  } catch(e) {
    console.log('generateInformOverall', data);
    throw e;
  }
}

function generateInformCause(data, title = '') {
  try {
    let informCauseStr = `${title}`;
    let higherGrade = 1;
    let higherCnt = 0;

    const gradeKinds = data.map((item, idx) => {
      return {
        grade: idx,
        cnt: item.length
      }
    });

    for (const item of gradeKinds) {
      if(item.cnt > higherCnt) {
        higherGrade = item.grade;
        higherCnt = item.cnt;
        break;
      }
    }

    if(higherGrade >= 3) {
      informCauseStr = `${informCauseStr} 편서풍의 영향으로 대기 상태가 대체로 '${convertGradeToKorean(higherGrade)}' 수준일 것으로 예상됩니다.`;
    } else {
      informCauseStr = `${informCauseStr} 원활한 대기 확산으로 대기 상태가 대체로 '${convertGradeToKorean(higherGrade)}' 수준일 것으로 예상됩니다.`;
    }

    return informCauseStr;
  } catch(e) {
    console.log('generateInformCause', data);
    throw e;
  }
}

function generateDataForecast(dataArr) {
  const [dataTime, informCode, informOverall, informCause, informGrade, actionKnack, informDate] = dataArr;

  return {
    data_time: dataTime.format('YYYY-MM-DD HH:mm:ss'),
    inform_code: informCode,
    inform_overall: informOverall,
    inform_cause: informCause,
    inform_grade: informGrade.join(','),
    action_knack: actionKnack,
    inform_date: informDate.format('YYYY-MM-DD HH:mm:ss'),
    created_at: dataTime.format('YYYY-MM-DD HH:mm:ss'),
    updated_at: dataTime.format('YYYY-MM-DD HH:mm:ss'),
  }
}