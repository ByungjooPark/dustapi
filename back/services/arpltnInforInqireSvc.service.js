/**
 * @file services/arpltnInforInqireSvc.service.js
 * @description arpltnInforInqireSvc(대기오염정보) service 파일
 * 251008 v1.0 meerkat
 */

import dayjs from "dayjs";
import { PAGINATION_POLICY_LIMIT, PAGINATION_POLICY_PAGE_NO } from "../configs/paginationPolicy.config.js";
import { paginationObservations } from "../repositories/observation.repository.js";
import { getLargestDateTimeByHourPeriod, getStartAndEndDateUsingDataTerm } from "../utils/dateFormatter.util.js";
import { sidoNameList } from "../configs/fieldParams.config.js";
import { paginationForecast } from "../repositories/forecast.repository.js";
import { calculationLimitAndOffset } from "../utils/dataFormatter.util.js";

/**
 * 1 : 측정소명과 측정데이터 기간(일,한달,3개월)으로 해당 측정소의 일반항목 측정정보를 제공하는 측정소별 실시간 측정정보조회
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
    sidoName: null
  };

  // repository 호출
  const result = await paginationObservations(null, queryParams);
  result.pageNo = pageNo;
  result.numOfRows = numOfRows;

  return result;
}

/**
 * 3 : 시도명을 검색조건으로 하여 시도별 측정소목록에 대한 일반 항목과 CAI최종 실시간 측정값과 지수 정보 조회 기능을 제공하는 시도별 실시간 측정정보 조회
 * 
 * @param {import("express").Response} req 
 * @param {import("express").Request} res 
 * @param {import("express").NextFunction} next 
 * @returns {{pageNo: number, numOfRows: number, count: number, rows: import("sequelize").Model<Observation>[]}}
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
    stationName: null,
    sidoName: sidoName !== sidoNameList[0] ? sidoName : '',
  };

  // repository 호출
  const result = await paginationObservations(null, queryParams);
  result.pageNo = pageNo;
  result.numOfRows = numOfRows;

  return result;
}

/**
 * 4 : 통보코드와 통보시간으로 예보정보와 발생 원인 정보를 조회하는 대기질(미세먼지/오존) 예보통보 조회
 * 
 * @param {import("express").Response} req 
 * @param {import("express").Request} res 
 * @param {import("express").NextFunction} next 
 * @returns {{count: number, rows: import("sequelize").Model<Forecast>[], pageNo?: number, numOfRows?: number}}
 */
export async function getMinuDustFrcstDspth(req, res, next) {
  const {numOfRows = PAGINATION_POLICY_LIMIT, pageNo = PAGINATION_POLICY_PAGE_NO, searchDate = null, informCode = null} = req.query;

  const {limit, offset} = calculationLimitAndOffset(parseInt(pageNo), parseInt(numOfRows));

  const now = dayjs();
  let targetDate = null;
  let searchDateList = [];

  // 조회 일자 생성 처리
  if(searchDate) {
    // 조회 일자 입력이 있을 경우 해당 일자 셋
    targetDate = dayjs(searchDate, 'YYYY-MM-DD');

    // 조회 일자 리스트 생성
    searchDateList.push(getLargestDateTimeByHourPeriod(targetDate, now));
  } else {
    // 조회 일자 입력이 없을 경우 한달 전 일자 셋
    targetDate = now.subtract(1, 'month');

    // 조회 일자 리스트 생성
    while(targetDate.isBefore(now) || targetDate.isSame(now)) {
      searchDateList.push(getLargestDateTimeByHourPeriod(targetDate, now));
      targetDate = targetDate.add(1, 'day');
    }
  }
  const queryParams = {
    limit: searchDate ? null : limit,
    offset: searchDate ? null : offset,
    searchDateList: searchDateList,
    informCode: informCode,
    searchDate: searchDate,
  }
  
  const result = await paginationForecast(null, queryParams);
  if(!searchDate) {
    result.pageNo = pageNo;
    result.numOfRows = numOfRows;
  }

  return result;
}
