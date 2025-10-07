/**
 * @file types/utils/calcuratorCAI.util.type.js
 * @description `utils/calcuratorCAI.util.js`에서 사용하는 타입 정의 파일
 * 251007 v1.0 meerkat
 */

/**
 * 기준 등급 정보 객체
 * @typedef {{grade: number, bplo: number, bphi: number}} StandardGradeInfo
 */

/**
 * 기준 등급 정보 객체 배열
 * @typedef {Array<StandardGradeInfo>} StandardGradeInfoList
 */

/**
 * 오염물질 정보 객체
 * @typedef {Object} GradeInfo
 * @property {string} code - 오염물질 코드 (예: PM25, PM10, CO...)
 * @property {number} val - 오염물질 수치
 * @property {number} grade - 오염 등급
 * @property {number} indexScore - CIA계산 수치
 */

export {};