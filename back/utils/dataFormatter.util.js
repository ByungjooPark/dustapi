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

/**
 * 
 * @param {number|null} pageNo - 페이지 번호
 * @param {number|null} numOfRows - 한페이지 출력 갯수
 * @returns {{limit: number, offset: number}} 계산 된 리미트 및 오프셋을 담은 객체
 */
export function calculationLimitAndOffset(pageNo, numOfRows) {
  const limit = numOfRows ? numOfRows : PAGINATION_POLICY_LIMIT;
  const page = pageNo ? pageNo : PAGINATION_POLICY_PAGE_NO;
  const offset = (page - 1) * limit;

  return {limit, offset};
}