/**
 * @file configs/responseCode.config.js
 * @description 서비스 전역 응답 코드 설정 모듈 , 각 API 응답 시 참조되는 표준 응답 코드 정의
 * 251007 v1.0 meerkat
 */

/**
 * 전역 응답 코드 설정
 * @type {{[key: string]: import('../types/configs/responseCode.config.type.js').ResponseCodeConfig}}
 */
export const SUCCESS = {
  code: '00',
  msg: 'NORMAL_CODE',
  info: '정상 처리',
  status: 200
};

/**
 * 전역 응답 코드 설정
 * @type {{[key: string]: import('../types/configs/responseCode.config.type.js').ResponseCodeConfig}}
 */
export const SYSTEM_ERROR = {
  code: '01',
  msg: 'Application Error',
  info: '서비스 제공 상태가 원활하지 않습니다',
  status: 500
};

/**
 * 전역 응답 코드 설정
 * @type {{[key: string]: import('../types/configs/responseCode.config.type.js').ResponseCodeConfig}}
 */
export const DB_ERROR = {
  code: '02',
  msg: 'DB Error',
  info: '서비스 제공 상태가 원활하지 않습니다',
  status: 500
};

/**
 * 전역 응답 코드 설정
 * @type {{[key: string]: import('../types/configs/responseCode.config.type.js').ResponseCodeConfig}}
 */
export const NO_DATA = {
  code: '03',
  msg: 'No Data',
  info: '데이터 없음 에러',
  status: 204 // No Content
};

/**
 * 전역 응답 코드 설정
 * @type {{[key: string]: import('../types/configs/responseCode.config.type.js').ResponseCodeConfig}}
 */
export const HTTP_ERROR = {
  code: '04',
  msg: 'HTTP Error',
  info: '서비스 제공 상태가 원활하지 않습니다',
  status: 502 // Bad Gateway (외부 서비스 호출 실패)
};

/**
 * 전역 응답 코드 설정
 * @type {{[key: string]: import('../types/configs/responseCode.config.type.js').ResponseCodeConfig}}
 */
export const TIME_OUT_ERROR = {
  code: '05',
  msg: 'service time out',
  info: '서비스 제공 상태가 원활하지 않습니다',
  status: 504 // Gateway Timeout
};

/**
 * 전역 응답 코드 설정
 * @type {{[key: string]: import('../types/configs/responseCode.config.type.js').ResponseCodeConfig}}
 */
export const BAD_REQUEST_ERROR = {
  code: '10',
  msg: '잘못된 요청 파라미터 에러',
  info: 'OpenAPI 요청시 파라미터값 요청이 잘못되었습니다',
  status: 400
};

/**
 * 전역 응답 코드 설정
 * @type {{[key: string]: import('../types/configs/responseCode.config.type.js').ResponseCodeConfig}}
 */
export const NOT_REQUIRE_PARAMETER_ERROR = {
  code: '11',
  msg: '필수 요청 파라미터 없음',
  info: '요청하신 OpenAPI의 필수 파라미터가 누락되었습니다',
  status: 400
};

/**
 * 전역 응답 코드 설정
 * @type {{[key: string]: import('../types/configs/responseCode.config.type.js').ResponseCodeConfig}}
 */
export const NOT_FOUND_ERROR = {
  code: '12',
  msg: '해당 오픈API 서비스가 없거나 폐기됨',
  info: 'OpenAPI 호출시 URL이 잘못됨',
  status: 404
};

/**
 * 전역 응답 코드 설정
 * @type {{[key: string]: import('../types/configs/responseCode.config.type.js').ResponseCodeConfig}}
 */
export const FORBIDDEN_ERROR = {
  code: '20',
  msg: '서비스 접근 거부',
  info: '활용 신청하지 않은 OpenAPI 호출',
  status: 403
};

/**
 * 전역 응답 코드 설정
 * @type {{[key: string]: import('../types/configs/responseCode.config.type.js').ResponseCodeConfig}}
 */
export const OVER_TRAFFIC_ERROR = {
  code: '22',
  msg: '서비스 요청 제한 횟수 초과 에러',
  info: '하루 트래픽 제한을 초과함',
  status: 429 // Too Many Requests
};

/**
 * 전역 응답 코드 설정
 * @type {{[key: string]: import('../types/configs/responseCode.config.type.js').ResponseCodeConfig}}
 */
export const UNAUTHORIZED_ERROR = {
  code: '30',
  msg: '등록하지 않은 서비스키',
  info: '잘못된 서비스키를 사용하였거나 서비스키를 URL 인코딩하지 않음',
  status: 401 // Unauthorized
};

/**
 * 전역 응답 코드 설정
 * @type {{[key: string]: import('../types/configs/responseCode.config.type.js').ResponseCodeConfig}}
 */
export const EXPIRED_SERVICEKEY_ERROR = {
  code: '31',
  msg: '서비스키 사용 기간 만료',
  info: 'OpenAPI 사용기간이 만료됨(활용기간 연장신청 후 사용가능)',
  status: 401
};

/**
 * 전역 응답 코드 설정
 * @type {{[key: string]: import('../types/configs/responseCode.config.type.js').ResponseCodeConfig}}
 */
export const NOT_REGIST_DOMAIN_ERROR = {
  code: '32',
  msg: '등록하지 않은 도메인명 또는 IP주소',
  info: '활용신청한 서버의 IP와 실제 OpenAPI 호출한 서버가 다를 경우',
  status: 403
};

/**
 * 전역 응답 코드 설정
 * @type {{[key: string]: import('../types/configs/responseCode.config.type.js').ResponseCodeConfig}}
 */
export const NOT_APPROVE_ERROR = {
  code: '34',
  msg: '보고서가 등록 되지 않음',
  info: '개발보고서가 아직 승인되지 않은 경우',
  status: 403
};

