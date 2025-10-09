/**
 * @file utils/dataFormatter.util.js
 * @description dataFormatter Util 파일
 * 251008 v1.0 meerkat
 */

/**
 * 소수점 숫자를 특정 소수점 자리수 만큼 잘라서 문자열로 반환
 * @param {any} val - 소수점 숫자
 * @param {number} decimalPlace - 자를고 싶은 소수점 자리수
 * @returns {string} 소수점 숫자 문자열
 */
export function subDecimalPlace(val, decimalPlace) {
  return parseFloat(val).toFixed(decimalPlace);
}