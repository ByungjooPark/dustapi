import { validationResult } from 'express-validator';
import { BaseResponseDTO } from '../dto/responseDTO/BaseResponseDTO.js';
import { responseCodeConfig } from '../configs/responseCodeConfig.js';

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
    const baseResponseDTO = new BaseResponseDTO(responseCode.code, responseCode.msg, { errors: errors.array() });
    return response.status(responseCode.status).json(baseResponseDTO.getResponse());
  }

  next();
}