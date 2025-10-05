import { validationResult } from 'express-validator';
import { BaseResponseDTO } from '../dto/responseDTO/BaseResponseDTO';

export default function validationHandler(request, response, next) {
  const errors = validationResult(request);

  const responseCode = responseCodeConfig['10'];
  const baseResponseDTO = new BaseResponseDTO(responseCode.code, responseCode.msg, { errors: errors.array() });
  if (!errors.isEmpty()) {
    return response.status(400).json(baseResponseDTO.getResponse());
  }
  next();
}