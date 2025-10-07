/**
 * @file validations/validationHandler.js
 * @description 유효성 검사 핸들러 파일
 * 251007 v1.0 meerkat
 */

import { validationResult } from 'express-validator';
import { BAD_REQUEST_ERROR, UNAUTHORIZED_ERROR } from '../configs/responseCode.config.js';
import { createbaseResponseDTO } from '../dto/baseResponse.dto.js';

export default function validationHandler(request, response, next) {
  const errors = validationResult(request);
  const serviceKeyErrFlg = errors.array().some(item => item.path === 'serviceKey');

  let responseCode = null;
  if(!serviceKeyErrFlg) {
    responseCode = BAD_REQUEST_ERROR;
  } else {
    responseCode = UNAUTHORIZED_ERROR;
  }
  
  if (!errors.isEmpty()) {
    const errorCustom = errors.formatWith(error => `${error.path}: ${error.msg}`);
    return response.status(responseCode.status).send(createbaseResponseDTO(responseCode, { errors: errorCustom.array() }));
  }

  next();
}