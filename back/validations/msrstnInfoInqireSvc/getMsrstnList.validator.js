/**
 * @file validations/arpltnInforInqireSvc/getMsrstnList.validator.js
 * @description `getMsrstnList` 유효성 검사 필드 설정 파일
 * 251011 v1.0 meerkat
 */

import { numOfRows, pageNo, returnType, serviceKey, addr, stationName } from "./fields/msrstnInfoInqireSvc.field.js";

export default [
  serviceKey,
  returnType,
  numOfRows,
  pageNo,
  addr,
  stationName,
];