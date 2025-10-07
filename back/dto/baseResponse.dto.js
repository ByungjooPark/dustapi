/**
 * @file dto/baseResponse.dto.js
 * @description baseResponse DTO 파일
 * 251007 v1.0 meerkat
 */

/**
 * 기본 응답 DTO를 생성
 * @param {import("../types/configs/responseCode.config.type.js").ResponseCodeConfig} responseCode - 결과 코드 정보
 * @param {any} [body=null] - 응답 데이터
 * @returns {import("../types/dto/baseResponse.dto.type.js").BaseResponseDTO} 최종 응답 객체
 */
export function createbaseResponseDTO(responseCode, body = null) {
  const response = {
    response: {
      header: {
        resultCode: responseCode.code,
        resultMsg: responseCode.msg
      }
    }
  };

  if(body) {
    response.response.body = body;
  }

  return response;
}