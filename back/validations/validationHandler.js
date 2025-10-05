import { validationResult } from 'express-validator';
import { responseCodeConfig } from '../configs/responseCodeConfig.js';
import { createBaseResponseDTO } from '../dto/baseResponseDTO.js';

export default function validationHandler(request, response, next) {
  const errors = validationResult(request);
  const serviceKeyErrFlg = errors.array().some(item => item.path === 'serviceKey');

  let responseCode = null;
  if(!serviceKeyErrFlg) {
    responseCode = responseCodeConfig['10'];
  } else {
    responseCode = responseCodeConfig['30'];
  }
  
  if (!errors.isEmpty()) {
    const errorCustom = errors.formatWith(error => `${error.path}: ${error.msg}`);
    return response.status(responseCodeConfig.BAD_REQUEST_ERROR.status).send(createBaseResponseDTO(responseCodeConfig.BAD_REQUEST_ERROR, { errors: errorCustom.array() }));
  }

  next();
}