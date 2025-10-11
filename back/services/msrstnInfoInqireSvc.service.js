/**
 * @file routes/msrstnInfoInqireSvc.service.js
 * @description 측정소정보 조회 서비스 service 파일
 * 251011 v1.0 meerkat
 */

import { PAGINATION_POLICY_LIMIT, PAGINATION_POLICY_PAGE_NO } from "../configs/paginationPolicy.config.js";
import { getMsrstnListByTm, paginationMsrstnListByAddr } from "../repositories/station.repository.js";
import { calculationLimitAndOffset } from "../utils/dataFormatter.util.js";

/**
 * 측정소 주소 또는 측정소 명칭으로 검색하여 측정소 목록 또는 단 건의 측정소 상세 정보 조회 기능
 * 
 * @param {import("express").Response} req 
 * @param {import("express").Request} res 
 * @param {import("express").NextFunction} next 
 * @returns {{pageNo: number, numOfRows: number, count: number, rows: import('sequelize').Model<Station>[]}}
 */
export async function getMsrstnList(req, res, next) {
  const {numOfRows = PAGINATION_POLICY_LIMIT, pageNo = PAGINATION_POLICY_PAGE_NO, addr, stationName} = req.query;

  // Repository Params 설정
  const {limit, offset} = calculationLimitAndOffset(parseInt(pageNo), parseInt(numOfRows));

  const params = {
    limit: limit,
    offset: offset,
    addr: addr || null,
    stationName: stationName || null,
  };

  const result = await paginationMsrstnListByAddr(null, params);
  result.pageNo = pageNo;
  result.numOfRows = numOfRows;

  return result;
}

/**
 * TM 좌표를 입력하여 입력된 좌표 주변 측정소 정보와 입력 좌표와의 거리 조회 기능 (가까운 순 10개 조회)
 * 
 * @param {import("express").Response} req 
 * @param {import("express").Request} res 
 * @param {import("express").NextFunction} next 
 * @returns {{pageNo: number, numOfRows: number, count: number, rows: import('sequelize').Model<Observation>[]}}
 */
export async function getAllMsrstnListByTm(req, res, next) {
  const {tmX, tmY} = req.query;

  return await getMsrstnListByTm(null, {tmX, tmY});
}