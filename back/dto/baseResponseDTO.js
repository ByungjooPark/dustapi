/**
 * 기본 응답 객체를 생성하는 함수
 * @param {responseCodeConfig} responseCode - 결과 코드 정보
 * @param {any} [body=null] - 응답 데이터
 * @returns {object} 최종 응답 객체
 */
export function createBaseResponseDTO(responseCode, body = null) {
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