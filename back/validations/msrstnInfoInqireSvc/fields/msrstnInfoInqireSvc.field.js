/**
 * @file validations/arpltnInforInqireSvc/fields/msrstnInfoInqireSvc.field.js
 * @description `msrstnInfoInqireSvc` 유효성 검사에서 사용하는 필드 정의 파일
 * 251011 v1.0 meerkat
 */

import { query } from 'express-validator';
import { sidoNameList } from '../../../configs/fieldParams.config.js';

// serviceKey: 필수
export const serviceKey = query('serviceKey')
  .exists().withMessage('필수 요소입니다.')
  .bail()
  .custom((val) =>{
    return val === process.env.DUST_API_SERVICEKEY;
  }).withMessage('등록하지 않은 서비스키입니다.');

// returnType: 선택
export const returnType = query('returnType')
  .optional()
  .isIn(['xml', 'json'])
  .withMessage('xml 또는 json이어야 합니다.');

// numOfRows: 선택
export const numOfRows = query('numOfRows')
  .optional()
  .isInt({ min: 1 })
  .withMessage('1 이상의 정수여야 합니다.');

// pageNo: 선택
export const pageNo = query('pageNo')
  .optional()
  .isInt({ min: 1 })
  .withMessage('1 이상의 정수여야 합니다.');

// addr: 선택
export const addr = query('addr')
  .optional()
  .isIn(sidoNameList)
  .withMessage('부적절한 주소명(시도명)입니다.');

// stationName: 선택
export const stationName = query('stationName')
  .optional()
  .matches(/^[A-Za-z가-힣0-9(). ]{1,30}$/u)
  .withMessage('부적절한 측정소명입니다.');

// tmX: 필수
export const tmX = query('tmX')
  .exists().withMessage('필수 요소입니다.')
  .bail()
  .matches(/^[0-9.]{1,16}$/u)
  .withMessage('부적절한 TM_X 좌표입니다.');

// tmY: 필수
export const tmY = query('tmY')
  .exists().withMessage('필수 요소입니다.')
  .bail()
  .matches(/^[0-9.]{1,16}$/u)
  .withMessage('부적절한 TM_Y 좌표입니다.');
