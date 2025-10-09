/**
 * @file configs/pagenationPolicy.config.js
 * @description pagenationPolicy config 파일
 * 251008 v1.0 meerkat
 */

export const PAGINATION_POLICY_LIMIT = 100;
export const PAGINATION_POLICY_PAGE_NO = 1;

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