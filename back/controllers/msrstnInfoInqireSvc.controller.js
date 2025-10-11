/**
 * @file routes/msrstnInfoInqireSvc.controller.js
 * @description 측정소정보 조회 서비스 controller 파일
 * 251011 v1.0 meerkat
 */

import { SUCCESS } from "../configs/responseCode.config.js";
import { createbaseResponseDTO } from "../dto/baseResponse.dto.js";
import { getAllMsrstnListByTm, getMsrstnList } from "../services/msrstnInfoInqireSvc.service.js";

/**
 * 측정소정보 조회 서비스 - 상세기능 1 : 측정소 목록 조회
 * 측정소 주소 또는 측정소 명칭으로 검색하여 측정소 목록 또는 단 건의 측정소 상세 정보 조회 기능 제공
 * 
 * @param {import("express").Response} req 
 * @param {import("express").Request} res 
 * @param {import("express").NextFunction} next 
 * @returns {import("express").Request} res
 */
export async function msrstnList(req, res, next) {
  try {
    const {numOfRows, pageNo, count, rows} = await getMsrstnList(req, res, next);

    const transData = rows.map(item => {
      return {
        stationCode: item.stationCode,
        stationName: item.stationName,
        addr: item.address,
        mangName: item.mangName,
        dmX: item.tmX,
        dmY: item.tmY,
      }
    });

    return res
          .status(SUCCESS.status)
          .send(createbaseResponseDTO(SUCCESS, {numOfRows: numOfRows, pageNo: pageNo, totalCount: count, items: transData}));
  } catch(e) {
    next(e);
  }
}


/**
 * 측정소정보 조회 서비스 - 상세기능 2 : 근접측정소 목록 조회
 * TM 좌표를 입력하여 입력된 좌표 주변 측정소 정보와 입력 좌표와의 거리 조회 기능 제공
 * 
 * @param {import("express").Response} req 
 * @param {import("express").Request} res 
 * @param {import("express").NextFunction} next 
 * @returns {import("express").Request} res
 */
export async function nearbyMsrstnList(req, res, next) {
  try {
    const resultSetvice = await getAllMsrstnListByTm(req, res, next);

    return res
          .status(SUCCESS.status)
          .send(createbaseResponseDTO(SUCCESS, {items: resultSetvice}));
  } catch(e) {
    next(e);
  }
}

/**
 * 측정소정보 조회 서비스 - 상세기능 3 : TM 기준좌표 조회
 * 
 * 
 * @param {import("express").Response} req 
 * @param {import("express").Request} res 
 * @param {import("express").NextFunction} next 
 * @returns {import("express").Request} res
 */
export async function tmstdrCrdnt(req, res, next) {
  try {
    
    return res
          .status(SUCCESS.status)
          .send(createbaseResponseDTO(SUCCESS, 'nearbyMsrstnList'));
  } catch(e) {
    next(e);
  }
}