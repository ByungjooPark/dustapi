'use strict';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

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
  const dateTimeFormat = dateFormatYYYYMMDDHHmiSSWith24HourToNextDay00Hour(dataTime);
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


// -------------- 이하 계산 관련 --------------
// 참조 : https://airkorea.or.kr/web/khaiInfo?pMENU_NO=129
// ------------------------------------------

/**
 * 통합대기환경지수(CAI, Comprehensive air-quality index) 정보 생성
 * @param {{code: string, val: number, grade: number, indexScore: number}|null} so2GradeInfo 
 * @param {{code: string, val: number, grade: number, indexScore: number}|null} coGradeInfo 
 * @param {{code: string, val: number, grade: number, indexScore: number}|null} o3GradeInfo 
 * @param {{code: string, val: number, grade: number, indexScore: number}|null} no2GradeInfo 
 * @param {{code: string, val: number, grade: number, indexScore: number}|null} pm10GradeInfo 
 * @param {{code: string, val: number, grade: number, indexScore: number}|null} pm25GradeInfo 
 * @returns 
 */
function generateCAIInfo(so2GradeInfo = null, coGradeInfo = null, o3GradeInfo = null, no2GradeInfo = null, pm10GradeInfo = null, pm25GradeInfo = null) {
  // 6개 대기오염물질별로 통합대기환경지수 점수를 산정하며 가장 높은 점수를 통합 지수값으로 사용
  // 산출된 각각의 오염물질별 지수점수가 '나쁨'이상의 등급이 2개 물질 이상일 경우 통합지수값에 가산점을 부여
  // - 1개일 경우 : 점수가 가장 높은 지수점수를 통합지수로 사용
  // - 2개일 경우 : 가장 높은 점수가 나온 오염물질을 영향 오염물질로 표시하고 그 오염물질의 점수에 50점을 가산
  // - 3개 이상일 경우 : 가장 높은 점수가 나온 오염물질을 영향 오염물질로 표시하고 그 오염물질의 점수에 75점 가산
  // 통합대기환경지수는 0에서 500까지의 지수를 4단계로 나누어 점수가 커질수록 대기상태가 좋지 않음을 나타냄
  try {
    const result = {cai: 0, code: '', grade: 0};
    const baseBadGrade = 3;
    let cntBadGrade = 0;
    const weight3OrMore = 75;
    const weight2OrMore = 50;
    const gradeInfoList = [so2GradeInfo, coGradeInfo, o3GradeInfo, no2GradeInfo, pm10GradeInfo, pm25GradeInfo];
    
    for(const gradeInfo of gradeInfoList) {
      if(gradeInfo === null) {
        continue;
      }
  
      // 나쁨 등급 이상 카운트
      if(gradeInfo.grade >= baseBadGrade) {
        cntBadGrade++;
      }
  
      // 통합대기환경지수 셋팅
      if(gradeInfo.indexScore >= result.cai) {
        result.cai = gradeInfo.indexScore;
        result.code = gradeInfo.code;
        result.grade = gradeInfo.grade;
      }
    }
  
    // 통합대기환경지수 가중치 셋팅
    if(cntBadGrade >= 3) {
      result.cai += weight3OrMore;
    } else if(cntBadGrade >= 2) {
      result.cai += weight2OrMore;
    }
  
    return result;
  } catch (e) {
    console.error(gradeInfoList);
    throw e;
  }
}

/**
 * 오염물질별 지수 계산
 * @param {string} grade 
 * @param {number} bplo 
 * @param {number} bphi 
 * @param {number} cp 
 * @returns {number} CAI
 */
function calcurationAIInfo(grade, bplo, bphi, cp) {
  // Ip = 대상 오염물질의 대기지수 점수
  // Cp = 대상 오염물질의 대기중 농도
  // BPHI = 대상 오염물질의 오염도 해당 구간에 대한 최고 오염도
  // BPLO = 대상 오염물질의 오염도 해당 구간에 대한 최저 오염도
  // IHI = BPHI에 해당하는 지수값(구간 최고 지수값)
  // ILO = BPLO에 해당하는 지수값(구간 최저 지수값)

  try {
    const iList = {'1': [0, 50], '2': [51, 100], '3': [101, 250], '4': [251, 500]};
    const [ilo, ihi] = iList[grade];
  
    return Math.round(((ihi - ilo) / (bphi - bplo)) * (cp - bplo) + ilo);
  } catch(e) {
    console.error(grade, bplo, bphi, cp);
    throw e;
  }
}

/**
 * 측정값에 해당하는 등급 정보 생성
 *
 * @param {string} code - 오염물질 코드
 * @param {Array<{grade: number, bplo: number, bphi: number}>} gradeInfoList - 등급 기준 정보 리스트
 * @param {string} val - 측정값 (빈 문자열일 경우 null 반환)
 * @returns {{code: string, val: number, grade: number, indexScore: number}|null} 등급 계산 결과
 */
function generateGradeInfo(code, gradeInfoList, val) {
  try {
    if(val === '') {
      return null;
    }
    const floatVal = parseFloat(val);
    const gradeInfo = gradeInfoList.find(infoItem => infoItem.bphi >= floatVal) || gradeInfoList[(gradeInfoList.length - 1)]; // 기준치 초과시 마지막 등급 고정
  
    return {
      code: code,
      val: val,
      grade: gradeInfo.grade,
      indexScore: calcurationAIInfo(gradeInfo.grade, gradeInfo.bplo, gradeInfo.bphi, floatVal)
    }
  } catch(e) {
    console.error(code, gradeInfoList, val);
    throw e;
  }
}

/**
 * SO2 등급 정보 생성
 * @param {string} param - 측정값
 * @returns {{code: string, val: number, grade: number, indexScore: number}|null} 등급 계산 결과
 */
function generateGradeInfoSo2(param) {
  const code = 'SO2';
  const gradeInfoList = [
    {grade: 1, bplo: 0, bphi: 0.0200},
    {grade: 2, bplo: 0.0201, bphi: 0.0500},
    {grade: 3, bplo: 0.0501, bphi: 0.1500},
    {grade: 4, bplo: 0.1501, bphi: 1.0000},
  ];

  return generateGradeInfo(code, gradeInfoList, param);
}

/**
 * CO 등급 정보 생성
 * @param {string} param - 측정값
 * @returns {{code: string, val: number, grade: number, indexScore: number}|null} 등급 계산 결과
 */
function generateGradeInfoCo(param) {
  const code = 'CO';
  const gradeInfoList = [
    {grade: 1, bplo: 0.00, bphi: 2.00},
    {grade: 2, bplo: 2.01, bphi: 9.00},
    {grade: 3, bplo: 9.01, bphi: 15.00},
    {grade: 4, bplo: 15.01, bphi: 50.00},
  ];

  return generateGradeInfo(code, gradeInfoList, param);
}

/**
 * O3 등급 정보 생성
 * @param {string} param - 측정값
 * @returns {{code: string, val: number, grade: number, indexScore: number}|null} 등급 계산 결과
 */
function generateGradeInfoO3(param) {
  const code = 'O3';
  const gradeInfoList = [
    {grade: 1, bplo: 0.0000, bphi: 0.0300},
    {grade: 2, bplo: 0.0301, bphi: 0.0900},
    {grade: 3, bplo: 0.0901, bphi: 0.1500},
    {grade: 4, bplo: 0.1501, bphi: 0.6000},
  ];

  return generateGradeInfo(code, gradeInfoList, param);
}

/**
 * NO2 등급 정보 생성
 * @param {string} param - 측정값
 * @returns {{code: string, val: number, grade: number, indexScore: number}|null} 등급 계산 결과
 */
function generateGradeInfoNo2(param) {
  const code = 'NO2';
  const gradeInfoList = [
    {grade: 1, bplo: 0.0000, bphi: 0.0300},
    {grade: 2, bplo: 0.0301, bphi: 0.0600},
    {grade: 3, bplo: 0.0601, bphi: 0.2000},
    {grade: 4, bplo: 0.2001, bphi: 2.0000},
  ];

  return generateGradeInfo(code, gradeInfoList, param);
}

/**
 * PM10 등급 정보 생성
 * @param {string} param - 측정값
 * @returns {{code: string, val: number, grade: number, indexScore: number}|null} 등급 계산 결과
 */
function generateGradeInfoPm10(param) {
  const code = 'PM10';
  const gradeInfoList = [
    {grade: 1, bplo: 0, bphi: 30},
    {grade: 2, bplo: 31, bphi: 80},
    {grade: 3, bplo: 81, bphi: 150},
    {grade: 4, bplo: 151, bphi: 600},
  ];

  return generateGradeInfo(code, gradeInfoList, param);
}

/**
 * Pm25 등급 정보 생성
 * @param {string} param - 측정값
 * @returns {{code: string, val: number, grade: number, indexScore: number}|null} 등급 계산 결과
 */
function generateGradeInfoPm25(param) {
  const code = 'PM2.5';
  const gradeInfoList = [
    {grade: 1, bplo: 0, bphi: 15},
    {grade: 2, bplo: 16, bphi: 35},
    {grade: 3, bplo: 36, bphi: 75},
    {grade: 4, bplo: 76, bphi: 500},
  ];

  return generateGradeInfo(code, gradeInfoList, param);
}

/**
 * 
 * @param {Array<string>} list - 측정치가 들어있는 배열
 * @returns {string} avg 측정치의 평균값 문자열 (list가 빈배열일 시 빈문자열)
 */
function calculationAvgValue(list) {
  if(list.length < 1) {
    return '';
  }

  return Math.round((list.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / list.length)).toString();
}

/**
 * 데이트 포맷(24시일 경우 다음날 00시로 포맷)
 * @param {string} date - `YYYYMMDDHH` 포멧
 * @returns {string} dateTime `YYYY-MM-DD HH:mi:ss` 포맷
 */
function dateFormatYYYYMMDDHHmiSSWith24HourToNextDay00Hour(date) {
  let year = date.substring(0, 4);
  let month = date.substring(4, 6);
  let day = date.substring(6, 8);
  let hour = date.substring(8, 10);
  let minute = '00';
  let seconds = '00';
  let newDate = null;
  let formatDateTime = '';
  
  if(hour !== '24') {
    formatDateTime = `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
    newDate = new Date(formatDateTime);
  } else {
    hour = '00';
    formatDateTime = `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
    newDate = new Date(formatDateTime);

    // 1일 후로 조정
    newDate.setDate(newDate.getDate() + 1);
  }

  // TODO: 2025년 고정(2025년 데이터만 제공 예정)
  newDate.setFullYear(2025);

  return `${newDate.getFullYear()}-${(newDate.getMonth() + 1).toString().padStart(2, '0')}-${(newDate.getDate()).toString().padStart(2, '0')} ${(newDate.getHours()).toString().padStart(2, '0')}:${minute}:${seconds}`;
}