/**
 * @file configs/morgan.config.js
 * @description morgan 설정 파일
 * 251011 v1.0 meerkat
 */

import dayjs from 'dayjs';
import morgan from 'morgan';
import { httpLogger } from './winston.config.js'; // morgan용 로거 가져오기

morgan.token('ko-timezone', () => {
    return dayjs().locale(process.env.APP_TZ).format('YYYY-MM-DD HH:mm:ss')
});

const format = '[:ko-timezone] :remote-addr ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" (:response-time ms)';

// morgan 스트림 설정
const stream = {
    // Winston의 'http' 레벨로 로그를 기록
    write: (message) => httpLogger.http(message.trim())
};

export default morgan(format, {stream});