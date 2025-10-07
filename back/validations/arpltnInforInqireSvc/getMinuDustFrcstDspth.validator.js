/**
 * @file validations/arpltnInforInqireSvc/getMinuDustFrcstDspth.validator.js
 * @description `getMinuDustFrcstDspth` 유효성 검사 필드 설정 파일
 * 251007 v1.0 meerkat
 */

import { informCode, numOfRows, pageNo, returnType, searchDate, serviceKey } from "./fields/arpltnInforInqireSvc.field.js";

export default [
  serviceKey,
  returnType,
  numOfRows,
  pageNo,
  searchDate,
  informCode,
];