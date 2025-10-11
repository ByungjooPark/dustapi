/**
 * @file controllers/arpltnInforInqireSvc.controller.js
 * @description arpltnInforInqireSvc(대기오염정보) 컨트롤러 파일
 * 251007 v1.0 meerkat
 */

import dayjs from "dayjs";
import { verList } from "../configs/fieldParams.config.js";
import { SUCCESS } from "../configs/responseCode.config.js";
import { createbaseResponseDTO } from "../dto/baseResponse.dto.js";
import { getCtprvnRltmMesureDnsty, getMinuDustFrcstDspth, getMsrstnAcctoRltmMesureDnsty } from "../services/arpltnInforInqireSvc.service.js";
import { subDecimalPlace } from "../utils/dataFormatter.util.js";
import { dateFormatter } from "../utils/dateFormatter.util.js";

/**
 * 대기오염정보 기술문서 - 상세기능 1 : 측정소별 실시간 측정정보 조회
 * 측정소명과 측정데이터 기간(일,한달,3개월)으로 해당 측정소의 일반항목 측정정보를 제공하는 측정소별 실시간 측정정보조회
 * ※ 버전(ver) 항목설명
 * - 버전을 포함하지 않고 호출할 경우 : PM2.5 데이터가 포함되지 않은 원래 오퍼레이션 결과 표출.
 * - 버전 1.0을 호출할 경우 : PM2.5 데이터가 포함된 결과 표출.
 * - 버전 1.1을 호출할 경우 : PM10, PM2.5 24시간 예측이동 평균데이터가 포함된 결과 표출.
 * - 버전 1.2을 호출할 경우 : 측정망 정보 데이터가 포함된 결과 표출.
 * - 버전 1.3을 호출할 경우 : PM10, PM2.5 1시간 등급 자료가 포함된 결과 표출
 * - 버전 1.4을 호출할 경우 : 측정소명, 측정소 코드 정보가 포함된 결과 표출
 * - 버전 1.5을 호출할 경우 : 측정값 소수점 아래 자리 수 확대 (CO : 1 → 2, O3/SO2/NO2 : 3 → 4)
 * 
 * @param {import("express").Response} req 
 * @param {import("express").Request} res 
 * @param {import("express").NextFunction} next 
 * @returns {import("express").Request} res
 */
export async function msrstnAcctoRltmMesureDnsty(req, res, next) {
  try {
    const {numOfRows, pageNo, count, rows} = await getMsrstnAcctoRltmMesureDnsty(req, res, next);
    
    // Response Data 가공
    const paramVer = req.query.ver ? parseFloat(req.query.ver) : 0.0;
    const [ver0, ver1, ver2, ver3, ver4, ver5] = verList.map(ver => parseFloat(ver));
    const transData = rows.map(item => {
      const data = {
        dataTime: item.dataTime,
        so2Value: subDecimalPlace(item.so2Value, 3),
        coValue: subDecimalPlace(item.coValue, 1),
        o3Value: subDecimalPlace(item.o3Value, 3),
        no2Value: subDecimalPlace(item.no2Value, 3),
        pm10Value: item.pm10Value,
        khaiValue: item.khaiValue,
        khaiGrade: item.khaiGrade,
        so2Grade: item.so2Grade,
        coGrade: item.coGrade,
        o3Grade: item.o3Grade,
        no2Grade: item.no2Grade,
        pm10Grade: item.pm10Grade,
        so2Flag: item.so2Flag,
        coFlag: item.coFlag,
        o3Flag: item.o3Flag,
        no2Flag: item.no2Flag,
        pm10Flag: item.pm10Flag,
      };
      
      if(paramVer >= ver0) {
        data.pm25Value = item.pm25Value;
        data.pm25Grade = item.pm25Grade;
        data.pm25Flag = item.pm25Flag;
      }
      if(paramVer >= ver1) {
        data.pm10Value24 = item.pm10Value24;
        data.pm25Value24 = item.pm25Value24;
      }
      if(paramVer >= ver2) {
        data.mangName = item.Station.mangName;
      }
      if(paramVer >= ver3) {
        data.pm10Grade1h = item.pm10Grade1h;
        data.pm25Grade1h = item.pm25Grade1h;
      }
      if(paramVer >= ver4) {
        data.stationName = item.Station.stationName;
        data.stationCode = item.Station.stationCode;
      }
      if(paramVer >= ver5) {
        data.coValue = subDecimalPlace(item.coValue, 2);
        data.so2Value = subDecimalPlace(item.so2Value, 4);
        data.o3Value = subDecimalPlace(item.o3Value, 4);
        data.no2Value = subDecimalPlace(item.no2Value, 4);
      }

      return data;
    });

    return res
      .status(SUCCESS.status)
      .send(createbaseResponseDTO(SUCCESS, {numOfRows: numOfRows, pageNo: pageNo, totalCount: count, items: transData}));
  } catch(e) {
    next(e);
  }
}

/**
 * 대기오염정보 기술문서 - 상세기능 3 : 시도별 실시간 측정정보 조회
 * 시도명을 검색조건으로 하여 시도별 측정소목록에 대한 일반 항목과 CAI최종 실시간 측정값과 지수 정보 조회 기능을 제공하는 시도별 실시간 측정정보 조회
 * ※ 버전(ver) 항목설명
 * - 버전을 포함하지 않고 호출할 경우 : PM2.5 데이터가 포함되지 않은 원래 오퍼레이션 결과 표출.
 * - 버전 1.0을 호출할 경우 : PM2.5 데이터가 포함된 결과 표출.
 * - 버전 1.1을 호출할 경우 : PM10, PM2.5 24시간 예측이동 평균데이터가 포함된 결과 표출.
 * - 버전 1.2을 호출할 경우 : 측정망 정보 데이터가 포함된 결과 표출.
 * - 버전 1.3을 호출할 경우 : PM10, PM2.5 1시간 등급 자료가 포함된 결과 표출
 * - 버전 1.4을 호출할 경우 : 측정소 코드 정보가 포함된 결과 표출
 * - 버전 1.5을 호출할 경우 : 측정값 소수점 아래 자리 수 확대 (CO : 1 → 2, O3/SO2/NO2 : 3 → 4)
 * 
 * @param {import("express").Response} req 
 * @param {import("express").Request} res 
 * @param {import("express").NextFunction} next 
 * @returns {import("express").Request} res
 */
export async function ctprvnRltmMesureDnsty(req, res, next) {
  try {
    const {numOfRows, pageNo, count, rows} = await getCtprvnRltmMesureDnsty(req, res, next);
    
    // Response Data 가공
    const paramVer = req.query.ver ? parseFloat(req.query.ver) : 0.0;

    const [ver0, ver1, ver2, ver3, ver4, ver5] = verList.map(ver => parseFloat(ver));

    const transData = rows.map(item => {
      const data = {
        sidoName: item.Station.sidoName,
        stationName: item.Station.stationName,
        dataTime: item.dataTime,
        so2Value: subDecimalPlace(item.so2Value, 3),
        coValue: subDecimalPlace(item.coValue, 1),
        o3Value: subDecimalPlace(item.o3Value, 3),
        no2Value: subDecimalPlace(item.no2Value, 3),
        pm10Value: item.pm10Value,
        khaiValue: item.khaiValue,
        khaiGrade: item.khaiGrade,
        so2Grade: item.so2Grade,
        coGrade: item.coGrade,
        o3Grade: item.o3Grade,
        no2Grade: item.no2Grade,
        pm10Grade: item.pm10Grade,
        so2Flag: item.so2Flag,
        coFlag: item.coFlag,
        o3Flag: item.o3Flag,
        no2Flag: item.no2Flag,
        pm10Flag: item.pm10Flag,
      };
      
      if(paramVer >= ver0) {
        data.pm25Value = item.pm25Value;
        data.pm25Grade = item.pm25Grade;
        data.pm25Flag = item.pm25Flag;
      }
      if(paramVer >= ver1) {
        data.pm10Value24 = item.pm10Value24;
        data.pm25Value24 = item.pm25Value24;
      }
      if(paramVer >= ver2) {
        data.mangName = item.Station.mangName;
      }
      if(paramVer >= ver3) {
        data.pm10Grade1h = item.pm10Grade1h;
        data.pm25Grade1h = item.pm25Grade1h;
      }
      if(paramVer >= ver4) {
        data.stationCode = item.Station.stationCode;
      }
      if(paramVer >= ver5) {
        data.coValue = subDecimalPlace(item.coValue, 2);
        data.so2Value = subDecimalPlace(item.so2Value, 4);
        data.o3Value = subDecimalPlace(item.o3Value, 4);
        data.no2Value = subDecimalPlace(item.no2Value, 4);
      }

      return data;
    });
    
    return res
      .status(SUCCESS.status)
      .send(createbaseResponseDTO(SUCCESS, {numOfRows: numOfRows, pageNo: pageNo, totalCount: count, items: transData}));
  } catch(e) {
    next(e);
  }
}

/**
 * 대기오염정보 기술문서 - 상세기능 4 : 대기질 예보통보 조회
 * 통보코드와 통보시간으로 예보정보와 발생 원인 정보를 조회하는 대기질(미세먼지/오존) 예보통보 조회
 * 매일 4회(오전5시, 오전 11시, 오후5시(17시), 오후11시(23시))에 19개 권역으로 발표
 * 
 * @param {import("express").Response} req 
 * @param {import("express").Request} res 
 * @param {import("express").NextFunction} next 
 * @returns {import("express").Request} res
 */
export async function minuDustFrcstDspth(req, res, next) {
  try {
    const {numOfRows = null, pageNo = null, count, rows} = await getMinuDustFrcstDspth(req, res, next);

    // Response Data 가공
    const transData = rows.map(item => {
      const imageUrl1 = item.ForecastImages.find(fi => fi.position === 1).imageUrl;
      const imageUrl2 = item.ForecastImages.find(fi => fi.position === 2).imageUrl;
      const imageUrl3 = item.ForecastImages.find(fi => fi.position === 3).imageUrl;
      const imageUrl4 = item.ForecastImages.find(fi => fi.position === 4).imageUrl;
      const imageUrl5 = item.ForecastImages.find(fi => fi.position === 5).imageUrl;
      const imageUrl6 = item.ForecastImages.find(fi => fi.position === 6).imageUrl;
      const imageUrl7 = item.ForecastImages.find(fi => fi.position === 7).imageUrl;
      const imageUrl8 = item.ForecastImages.find(fi => fi.position === 8).imageUrl;
      const imageUrl9 = item.ForecastImages.find(fi => fi.position === 9).imageUrl;

      return {
        dataTime: `${dateFormatter(item.dataTime, 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH')}시 발표`,
        informCode: item.informCode,
        informOverall: item.informOverall,
        informCause: item.informCause,
        informGrade: item.informGrade,
        actionKnack: '-',
        imageUrl1: imageUrl1 ? `${process.env.AIRKOREA_IMAGE_URL}/${imageUrl1}` : '',
        imageUrl2: imageUrl2 ? `${process.env.AIRKOREA_IMAGE_URL}/${imageUrl2}` : '',
        imageUrl3: imageUrl3 ? `${process.env.AIRKOREA_IMAGE_URL}/${imageUrl3}` : '',
        imageUrl4: imageUrl4 ? `${process.env.AIRKOREA_IMAGE_URL}/${imageUrl4}` : '',
        imageUrl5: imageUrl5 ? `${process.env.AIRKOREA_IMAGE_URL}/${imageUrl5}` : '',
        imageUrl6: imageUrl6 ? `${process.env.AIRKOREA_IMAGE_URL}/${imageUrl6}` : '',
        imageUrl7: imageUrl7 ? `${process.env.AIRKOREA_IMAGE_URL}/${imageUrl7}` : '',
        imageUrl8: imageUrl8 ? `${process.env.AIRKOREA_IMAGE_URL}/${imageUrl8}` : '',
        imageUrl9: imageUrl9 ? `${process.env.AIRKOREA_IMAGE_URL}/${imageUrl9}` : '',
        informDate: dateFormatter(item.informDate, 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD'),
      }
    });

    const responseDate = {};
    if(numOfRows) {
      responseDate.numOfRows = numOfRows;
      responseDate.pageNo = pageNo;
    }
    responseDate.totalCount = count;
    responseDate.items = transData;

    return res
      .status(SUCCESS.status)
      .send(createbaseResponseDTO(SUCCESS, responseDate));
  } catch(e) {
    next(e);
  }
}