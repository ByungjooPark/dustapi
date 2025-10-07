/**
 * @file validations/ulfptcaAlarmInqireSvc/getUlfptcaAlarmInfo.validator.js
 * @description `getUlfptcaAlarmInfo` 유효성 검사 필드 설정 파일
 * 251007 v1.0 meerkat
 */

import { itemCode, numOfRows, pageNo, returnType, serviceKey, year } from './fields/ulfptcaAlarmInqireSvc.field.js';

export default [
  serviceKey,
  year,
  returnType,
  numOfRows,
  pageNo,
  itemCode,
];