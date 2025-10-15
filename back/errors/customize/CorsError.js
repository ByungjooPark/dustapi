/**
 * @file errors/customize/CorsError.js
 * @description CorsError 파일
 * 251015 v1.0 meerkat
 */

import { NOT_REGIST_DOMAIN_ERROR } from "../../configs/responseCode.config.js";

export class CorsError extends Error {
  codeInfo = NOT_REGIST_DOMAIN_ERROR;

  constructor(msg) {
    super();
    this.message = msg;
  }
}
