/**
 * @file errors/errorHeandler.js
 * @description errorHeandler 파일
 * 251007 v1.0 meerkat
 */

import { BaseError } from "sequelize";
import { DB_ERROR, SYSTEM_ERROR } from "../configs/responseCode.config.js";
import { logger } from "../configs/winston.config.js";

/**
 * 모든 에러는 `err.codeInfo`프로퍼티를 포함하고 있을 것
 * `err.codeInfo`은 {import('../types/configs/responseCode.config.type.js').ResponseCodeConfig}
 */
export default (err, req, res, next) => {
  if(!err.codeInfo) {
    // codeInfo가 없을 시, 시스템에러로 초기화
    err.codeInfo = SYSTEM_ERROR;

    // Sequelize 에러 처리
    if(err instanceof BaseError) {
      err.codeInfo = DB_ERROR;
    }
  }
  
  logger.error(`${err.stack}`);

  res.status(err.codeInfo.status).send(err.codeInfo);
}