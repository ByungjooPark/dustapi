/**
 * @file utils/dateFormatter.util.js
 * @description dateFormatter Util 파일
 * (dayjs 관련 참조 : https://day.js.org/docs/en/parse/string-format)
 * 
 * 251007 v1.0 meerkat
 */

import dayjs from 'dayjs';
import { dateTermList } from "../configs/fieldParams.config.js";
import { commonError } from '../errors/common.error.js';
import { SYSTEM_ERROR } from '../configs/responseCode.config.js';

/**
 * 데이트 포맷(24시일 경우 다음날 00시로 포맷)
 * @param {string} date - `YYYYMMDD` ~ `YYYYMMDDHHmiSS` 포맷 허용
 * @returns {string} dateTime `YYYY-MM-DD HH:mi:ss` 포맷 (허용 포맷 아닐경우 빈문자열 반환)
 */
export function dateFormatToYYYYMMDDHHmiSSWith24HourToNextDay00Hour(date) {
  const strLength = date.length;
  if(strLength < 6) {
    return '';
  }

  let year = date.substring(0, 4);
  let month = date.substring(4, 6);
  let day = date.substring(6, 8);
  let hour = strLength >= 10 ? date.substring(8, 10) : '00';
  let minute = strLength >= 12 ? date.substring(10, 12) : '00';
  let seconds = strLength >= 14 ? date.substring(12, 14) : '00';
  let newDate = null;
  let formatDateTime = '';
  
  if(hour !== '24') {
    formatDateTime = `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
    newDate = new Date(formatDateTime);
  } else {
    hour = '00';
    formatDateTime = `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
    newDate = new Date(formatDateTime);

    // 1일 후로 조정
    newDate.setDate(newDate.getDate() + 1);
  }

  // TODO: 2025년 고정(2025년 데이터만 제공 예정)
  newDate.setFullYear(2025);

  return `${newDate.getFullYear()}-${(newDate.getMonth() + 1).toString().padStart(2, '0')}-${(newDate.getDate()).toString().padStart(2, '0')} ${(newDate.getHours()).toString().padStart(2, '0')}:${minute}:${seconds}`;
}

/**
 * 현재 일자 기준 계산된 시작일(`YYYY-MM-DD 00:00:00`)과 현재 일자 기준 종료일(`YYYY-MM-DD HH:mi:ss`) 반환
 * @param {string} dataTerm - 'DAILY', 'MONTH', '3MONTH' 중 1
 * @returns {{startDate: string, endDate: string}} `YYYY-MM-DD 00:00:00`, `YYYY-MM-DD HH:mi:ss` 포맷
 */
export function getStartAndEndDateUsingDataTerm(dataTerm) {
  const [DAILY, MONTH, MONTH3] = dateTermList;
  const now = dayjs();
  let startDate = dayjs();

  if(dataTerm === MONTH) {
    startDate = startDate.subtract(1, 'month');
  } else if(dataTerm === MONTH3) {
    startDate = startDate.subtract(3, 'month');
  }

  return {
    startDate: startDate.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: now.format('YYYY-MM-DD HH:mm:ss')
  };
}

/**
 * 날짜를 기존 포맷에서 변경포맷으로 변경
 * @param {*} val - 날짜
 * @param {*} fromFormat - 기존 포멧 
 * @param {*} toFormat - 변경 포맷
 * @returns {string} 변경 포맷의 문자열
 */
export function dateFormatter(val, fromFormat, toFormat) {
  if(!val || !fromFormat || !toFormat) {
    throw commonError(SYSTEM_ERROR, `dateFormatter.util/dateFormatter: [${val}] [${fromFormat}] [${toFormat}]`);
  }
  return dayjs(val, fromFormat).format(toFormat);
}