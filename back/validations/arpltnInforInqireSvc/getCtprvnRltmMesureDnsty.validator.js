/**
 * @file validations/arpltnInforInqireSvc/getCtprvnRltmMesureDnsty.validator.js
 * @description `getCtprvnRltmMesureDnsty` 유효성 검사 필드 설정 파일
 * 251007 v1.0 meerkat
 */

import { numOfRows, pageNo, returnType, serviceKey, sidoName } from "./fields/arpltnInforInqireSvc.field.js";

export default [
  serviceKey,
  returnType,
  numOfRows,
  pageNo,
  sidoName,
];