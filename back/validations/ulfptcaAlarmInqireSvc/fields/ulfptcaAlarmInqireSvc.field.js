/**
 * @file validations/ulfptcaAlarmInqireSvc/fields/ulfptcaAlarmInqireSvc.field.js
 * @description `ulfptcaAlarmInqireSvc` 유효성 검사에서 사용하는 필드 정의 파일
 * 251007 v1.0 meerkat
 */

import { query } from 'express-validator';

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

// year: 필수
export const year = query('year')
  .exists().withMessage('필수 요소입니다.')
  .bail()
  .matches(/^\d{4}$/)
  .withMessage('4자리 숫자여야 합니다.');

// itemCode: 선택
export const itemCode = query('itemCode')
  .optional()
  .isIn(['PM10', 'PM25'])
  .withMessage('PM10 또는 PM25만 허용됩니다.');