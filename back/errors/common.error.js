/**
 * @file errors/common.error.js
 * @description 커스텀 에러 객체 반환 파일
 * 251007 v1.0 meerkat
 */

/**
 * 커스텀 에러 객체 반환
 * @param {import("../types/configs/responseCode.config.type").ResponseCodeConfig} codeInfo - 에레객체에 담을 응답 객체
 * @param {string} msg - 에러 메세지(log에 남음)
 * @returns {Error} err
 */
export function commonError(codeInfo, msg) {
  const err = new Error(msg);
  err.codeInfo = codeInfo;
  return err;
}