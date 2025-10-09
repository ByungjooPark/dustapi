/**
 * @file validations/arpltnInforInqireSvc/fields/arpltnInforInqireSvc.field.js
 * @description `arpltnInforInqireSvc` 유효성 검사에서 사용하는 필드 정의 파일
 * 251007 v1.0 meerkat
 */

import { query } from 'express-validator';
import { dateTermList, informCodeList, sidoNameList, verList } from '../../../configs/fieldParams.config.js';

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

// stationName: 필수
export const stationName = query('stationName')
  .exists().withMessage('필수 요소입니다.')
  .bail()
  .matches(/^[A-Za-z가-힣0-9()]{1,30}$/u)
  .withMessage('부적절한 측정소명입니다.');

// dataTerm: 필수
export const dataTerm = query('dataTerm')
  .exists().withMessage('필수 요소입니다.')
  .bail()
  .isIn(dateTermList)
  .withMessage(`${dateTermList.join(', ')}만 허용됩니다.`);

// sidoName: 필수
export const sidoName = query('sidoName')
  .exists().withMessage('필수 요소입니다.')
  .bail()
  .isIn(sidoNameList)
  .withMessage('부적절한 시도명입니다.');

// searchDate: 선택
export const searchDate = query('searchDate')
  .optional()
  .matches(/^\d{4}-\d{2}-\d{2}$/)
  .withMessage('YYYY-MM-DD 양식으로 작성해주십시오.')
  .bail()
  .custom((val) =>{
    return val === process.env.DUST_API_SERVICEKEY;
  }).withMessage('YYYY-MM-DD 양식으로 작성해주십시오.');

// informCode: 선택
export const informCode = query('informCode')
  .optional()
  .isIn(informCodeList)
  .withMessage(`${informCodeList.join(', ')}만 허용됩니다.`);

// ver: 선택
export const ver = query('ver')
  .optional()
  .isIn(verList)
  .withMessage(`${verList.join(', ')}만 허용됩니다.`);