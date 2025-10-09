/**
 * @file services/arpltnInforInqireSvc.service.js
 * @description arpltnInforInqireSvc(대기오염정보) service 파일
 * 251008 v1.0 meerkat
 */

import dayjs from "dayjs";
import { calculationLimitAndOffset, PAGINATION_POLICY_LIMIT, PAGINATION_POLICY_PAGE_NO } from "../configs/paginationPolicy.config.js";
import { paginationObservations } from "../repositories/Observations.repository.js";
import { getStartAndEndDateUsingDataTerm } from "../utils/dateFormatter.util.js";

/**
 * 측정소명과 측정데이터 기간(일,한달,3개월)으로 해당 측정소의 일반항목 측정정보를 제공하는 측정소별 실시간 측정정보조회
 * 
 * @param {import("express").Response} req 
 * @param {import("express").Request} res 
 * @param {import("express").NextFunction} next 
 * @returns {{pageNo: number, numOfRows: number, count: number, rows: import("sequelize").Model<Observation>[]}}
 */
export const getMsrstnAcctoRltmMesureDnsty = async (req, res, next) => {
  const {numOfRows = PAGINATION_POLICY_LIMIT, pageNo = PAGINATION_POLICY_PAGE_NO, stationName, dataTerm} = req.query;
  
  // Repository Params 설정
  const {limit, offset} = calculationLimitAndOffset(parseInt(pageNo), parseInt(numOfRows));
  const {startDate, endDate} = getStartAndEndDateUsingDataTerm(dataTerm);
  const queryParams = {
    limit: limit,
    offset: offset,
    startDate: startDate,
    endDate: endDate,
    stationName: stationName,
  };

  // repository 호출
  const result = await paginationObservations(null, queryParams);
  result.pageNo = pageNo;
  result.numOfRows = numOfRows;

  return result;
}

/**
 * 시도명을 검색조건으로 하여 시도별 측정소목록에 대한 일반 항목과 CAI최종 실시간 측정값과 지수 정보 조회 기능을 제공하는 시도별 실시간 측정정보 조회
 * 
 * @param {import("express").Response} req 
 * @param {import("express").Request} res 
 * @param {import("express").NextFunction} next 
 * @returns {{count: number, rows: import("sequelize").Model<Observation>[]}}
 */
export const getCtprvnRltmMesureDnsty = async (req, res, next) => {
  const {numOfRows = PAGINATION_POLICY_LIMIT, pageNo = PAGINATION_POLICY_PAGE_NO, sidoName} = req.query;
  const now = dayjs();
  
  // Repository Params 설정
  const {limit, offset} = calculationLimitAndOffset(parseInt(pageNo), parseInt(numOfRows));

  const queryParams = {
    limit: limit,
    offset: offset,
    startDate: now.subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    endDate: now.format('YYYY-MM-DD HH:mm:ss'),
    sidoName: sidoName,
  };

  // repository 호출
  const result = await paginationObservations(null, queryParams);
  result.pageNo = pageNo;
  result.numOfRows = numOfRows;

  return result;
}