/**
 * @file utils/calcuratorCAI.util.js
 * @description calcuratorCAI Util 파일
 * 계산식 참조 : https://airkorea.or.kr/web/khaiInfo?pMENU_NO=129
 * ------------------------------------------
 * 251007 v1.0 meerkat
 */

/**
 * 통합대기환경지수(CAI, Comprehensive air-quality index) 정보 생성
 * @param {import("../types/utils/calcuratorCAI.util.type").GradeInfo|null} so2GradeInfo - SO2 오염 정보
 * @param {import("../types/utils/calcuratorCAI.util.type").GradeInfo|null} coGradeInfo - CO 오염 정보
 * @param {import("../types/utils/calcuratorCAI.util.type").GradeInfo|null} o3GradeInfo - O3 오염 정보
 * @param {import("../types/utils/calcuratorCAI.util.type").GradeInfo|null} no2GradeInfo - No2 오염 정보
 * @param {import("../types/utils/calcuratorCAI.util.type").GradeInfo|null} pm10GradeInfo - PM10 오염 정보
 * @param {import("../types/utils/calcuratorCAI.util.type").GradeInfo|null} pm25GradeInfo - PM2.5 오염 정보
 * @returns 
 */
export function generateCAIInfo(so2GradeInfo = null, coGradeInfo = null, o3GradeInfo = null, no2GradeInfo = null, pm10GradeInfo = null, pm25GradeInfo = null) {
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
export function calcurationAIInfo(grade, bplo, bphi, cp) {
  // Ip = 대상 오염물질의 대기지수 점수
  // Cp = 대상 오염물질의 대기중 농도
  // BPHI = 대상 오염물질의 오염도 해당 구간에 대한 최고 오염도
  // BPLO = 대상 오염물질의 오염도 해당 구간에 대한 최저 오염도
  // IHI = BPHI에 해당하는 지수값(구간 최고 지수값)
  // ILO = BPLO에 해당하는 지수값(구간 최저 지수값)
  const iList = {'1': [0, 50], '2': [51, 100], '3': [101, 250], '4': [251, 500]};

  try {
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
 * @param {import("../types/utils/calcuratorCAI.util.type").StandardGradeInfoList} standardGradeInfoList - 기준 등급 정보 리스트
 * @param {number|null} val - 측정값 (빈 문자열일 경우 null 반환)
 * @returns {import("../types/utils/calcuratorCAI.util.type").GradeInfo|null} 등급 계산 결과
 */
export function generateGradeInfo(code, standardGradeInfoList, val) {
  try {
    if(val === null) {
      return null;
    }
    const floatVal = parseFloat(val);
    const gradeInfo = standardGradeInfoList.find(infoItem => infoItem.bphi >= floatVal) || standardGradeInfoList[(standardGradeInfoList.length - 1)]; // 기준치 초과시 마지막 등급 고정
  
    return {
      code: code,
      val: floatVal,
      grade: gradeInfo.grade,
      indexScore: calcurationAIInfo(gradeInfo.grade, gradeInfo.bplo, gradeInfo.bphi, floatVal)
    }
  } catch(e) {
    console.error(code, standardGradeInfoList, val);
    throw e;
  }
}

/**
 * SO2 등급 정보 생성
 * @param {number|null} param - 측정값
 * @returns {import("../types/utils/calcuratorCAI.util.type").GradeInfo|null} 등급 계산 결과
 */
export function generateGradeInfoSo2(param) {
  const code = 'SO2';
  const standardGradeInfoList = [
    {grade: 1, bplo: 0, bphi: 0.0200},
    {grade: 2, bplo: 0.0201, bphi: 0.0500},
    {grade: 3, bplo: 0.0501, bphi: 0.1500},
    {grade: 4, bplo: 0.1501, bphi: 1.0000},
  ];

  return generateGradeInfo(code, standardGradeInfoList, param);
}

/**
 * CO 등급 정보 생성
 * @param {number|null} param - 측정값
 * @returns {import("../types/utils/calcuratorCAI.util.type").GradeInfo|null} 등급 계산 결과
 */
export function generateGradeInfoCo(param) {
  const code = 'CO';
  const standardGradeInfoList = [
    {grade: 1, bplo: 0.00, bphi: 2.00},
    {grade: 2, bplo: 2.01, bphi: 9.00},
    {grade: 3, bplo: 9.01, bphi: 15.00},
    {grade: 4, bplo: 15.01, bphi: 50.00},
  ];

  return generateGradeInfo(code, standardGradeInfoList, param);
}

/**
 * O3 등급 정보 생성
 * @param {number|null} param - 측정값
 * @returns {import("../types/utils/calcuratorCAI.util.type").GradeInfo|null} 등급 계산 결과
 */
export function generateGradeInfoO3(param) {
  const code = 'O3';
  const standardGradeInfoList = [
    {grade: 1, bplo: 0.0000, bphi: 0.0300},
    {grade: 2, bplo: 0.0301, bphi: 0.0900},
    {grade: 3, bplo: 0.0901, bphi: 0.1500},
    {grade: 4, bplo: 0.1501, bphi: 0.6000},
  ];

  return generateGradeInfo(code, standardGradeInfoList, param);
}

/**
 * NO2 등급 정보 생성
 * @param {number|null} param - 측정값
 * @returns {import("../types/utils/calcuratorCAI.util.type").GradeInfo|null} 등급 계산 결과
 */
export function generateGradeInfoNo2(param) {
  const code = 'NO2';
  const standardGradeInfoList = [
    {grade: 1, bplo: 0.0000, bphi: 0.0300},
    {grade: 2, bplo: 0.0301, bphi: 0.0600},
    {grade: 3, bplo: 0.0601, bphi: 0.2000},
    {grade: 4, bplo: 0.2001, bphi: 2.0000},
  ];

  return generateGradeInfo(code, standardGradeInfoList, param);
}

/**
 * PM10 등급 정보 생성
 * @param {number|null} param - 측정값
 * @returns {import("../types/utils/calcuratorCAI.util.type").GradeInfo|null} 등급 계산 결과
 */
export function generateGradeInfoPm10(param) {
  const code = 'PM10';
  const standardGradeInfoList = [
    {grade: 1, bplo: 0, bphi: 30},
    {grade: 2, bplo: 31, bphi: 80},
    {grade: 3, bplo: 81, bphi: 150},
    {grade: 4, bplo: 151, bphi: 600},
  ];

  return generateGradeInfo(code, standardGradeInfoList, param);
}

/**
 * PM2.5 등급 정보 생성
 * @param {number|null} param - 측정값
 * @returns {import("../types/utils/calcuratorCAI.util.type").GradeInfo|null} 등급 계산 결과
 */
export function generateGradeInfoPm25(param) {
  const code = 'PM2.5';
  const standardGradeInfoList = [
    {grade: 1, bplo: 0, bphi: 15},
    {grade: 2, bplo: 16, bphi: 35},
    {grade: 3, bplo: 36, bphi: 75},
    {grade: 4, bplo: 76, bphi: 500},
  ];

  return generateGradeInfo(code, standardGradeInfoList, param);
}

/**
 * 
 * @param {Array<string>|Array<number>} list - 측정치가 들어있는 배열
 * @returns {number} avg 측정치의 평균값 문자열 (list가 빈배열일 시 빈문자열)
 */
export function calculationAvgValue(list) {
  if(list.length < 1) {
    return null;
  }

  return Math.round((list.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / list.length));
}

/**
 * 
 * @param {number} grade - 등급
 * @returns {string} 등급 한글
 */
export function convertGradeToKorean(grade) {
  switch (grade) {
    case 1:
      return '좋음';
    case 2:
      return '보통';
    case 3:
      return '나쁨';
    default:
      return '매우나쁨';
  }
}