/**
 * @file validations/arpltnInforInqireSvc/getNearbyMsrstnList.validator.js
 * @description `getNearbyMsrstnList` 유효성 검사 필드 설정 파일
 * 251011 v1.0 meerkat
 */

import { returnType, serviceKey, tmX, tmY } from "./fields/msrstnInfoInqireSvc.field.js";

export default [
  serviceKey,
  returnType,
  tmX,
  tmY
];