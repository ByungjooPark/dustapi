/**
 * @file routes/ulfptcaAlarmInqireSvc.controller.js
 * @description 미세먼지 경보 정보 controller 파일
 * 251011 v1.0 meerkat
 */

import dayjs from "dayjs";
import { SUCCESS } from "../configs/responseCode.config.js";
import { createbaseResponseDTO } from "../dto/baseResponse.dto.js";
import { getUlfptcaAlarmInfo } from "../services/ulfptcaAlarmInqireSvc.service.js";

/**
 * 측정소정보 조회 서비스 - 상세기능 1 : 미세먼지 경보 정보 현황 조회
 * 미세먼지(PM10, PM2.5)에 대한 지역별 주의보-경보 발령/해제시간, 농도를 조회
 * 
 * @param {import("express").Response} req 
 * @param {import("express").Request} res 
 * @param {import("express").NextFunction} next 
 * @returns {import("express").Request} res
 */
export async function ulfptcaAlarmInfo(req, res, next) {
  try {
    const {numOfRows, pageNo, count, rows} = await getUlfptcaAlarmInfo(req, res, next);

    const transData = rows.map(item => {
      return {
        sn: item.sn,
        dataDate: dayjs(item.dataDate).format('YYYY-MM-DD'),
        districtName: item.Location.districtName,
        moveName: item.Location.moveName,
        itemCode: item.itemCode,
        issueGbn: item.issueGbn,
        issueDate: dayjs(item.issueDate).format('YYYY-MM-DD'),
        issueTime: dayjs(item.issueDate).format('HH:mm'),
        issueVal: item.issueVal,
        clearDate: dayjs(item.clearDate).format('YYYY-MM-DD'),
        clearTime: dayjs(item.clearDate).format('HH:mm'),
        clearVal: item.clearVal,
      }
    });

    return res
          .status(SUCCESS.status)
          .send(createbaseResponseDTO(SUCCESS, {numOfRows: numOfRows, pageNo: pageNo, totalCount: count, items: transData}));
  } catch(e) {
    next(e);
  }
}