/**
 * @file validations/arpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty.validator.js
 * @description `getMsrstnAcctoRltmMesureDnsty` 유효성 검사 필드 설정 파일
 * 251007 v1.0 meerkat
 */

import { dataTerm, numOfRows, pageNo, returnType, serviceKey, stationName, ver } from "./fields/arpltnInforInqireSvc.field.js";

export default [
  serviceKey,
  returnType,
  numOfRows,
  pageNo,
  stationName,
  dataTerm,
  ver,
];