/**
 * @file utils/dataFormatter.util.js
 * @description dataFormatter Util 파일
 * 251008 v1.0 meerkat
 */

/**
 * 소수점 숫자를 특정 소수점 자리수 만큼 잘라서 반환
 * @param {number} val - 소수점 숫자
 * @param {number} decimalPlace - 자르고 싶은 소수점 자리 갯수
 * @returns {number} 소수점 숫자 문자열
 */
export function subDecimalPlace(val, decimalPlace) {
  const multiNum = parseInt('1'.padEnd(decimalPlace + 1, '0'));
  return Math.round(val * multiNum) / multiNum;
}