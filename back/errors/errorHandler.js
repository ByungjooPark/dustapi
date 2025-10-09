/**
 * @file errors/errorHeandler.js
 * @description errorHeandler 파일
 * 251007 v1.0 meerkat
 */

import { SYSTEM_ERROR } from "../configs/responseCode.config.js";

/**
 * 모든 에러는 `err.codeInfo`프로퍼티를 포함하고 있을 것
 * `err.codeInfo`은 {import('../types/configs/responseCode.config.type.js').ResponseCodeConfig}
 */
export default (err, req, res, next) => {
  if(!err.codeInfo) {
    err.codeInfo = SYSTEM_ERROR;
  }
  console.error(`${err.name}: ${err.message}`);
  res.status(err.codeInfo.status).send(err.codeInfo);
}