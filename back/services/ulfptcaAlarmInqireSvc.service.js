/**
 * @file services/ulfptcaAlarmInqireSvc.service.js
 * @description 미세먼지 경보 정보 service 파일
 * 251011 v1.0 meerkat
 */

import dayjs from "dayjs";
import { PAGINATION_POLICY_LIMIT, PAGINATION_POLICY_PAGE_NO } from "../configs/paginationPolicy.config.js";
import { paginationForecastAlert } from "../repositories/forecastAlert.repository.js";
import { calculationLimitAndOffset } from "../utils/dataFormatter.util.js";

/**
 * 미세먼지(PM10, PM2.5)에 대한 지역별 주의보-경보 발령/해제시간, 농도를 조회
 * 
 * @param {import("express").Response} req 
 * @param {import("express").Request} res 
 * @param {import("express").NextFunction} next 
 * @returns {{pageNo: number, numOfRows: number, count: number, rows: import('sequelize').Model<ForecastAlert>[]}}
 */
export async function getUlfptcaAlarmInfo(req, res, next) {
  const {numOfRows = PAGINATION_POLICY_LIMIT, pageNo = PAGINATION_POLICY_PAGE_NO, itemCode = null, year} = req.query;
  const {limit, offset} = calculationLimitAndOffset(parseInt(pageNo), parseInt(numOfRows));

  const queryParams = {
    limit: limit,
    offset: offset,
    startDate: dayjs(year, 'YYYY').startOf('year').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs(year, 'YYYY').endOf('year').format('YYYY-MM-DD HH:mm:ss'),
    itemCode: itemCode,
  };

  const result = await paginationForecastAlert(null, queryParams);
  result.pageNo = pageNo;
  result.numOfRows = numOfRows;

  return result;
}