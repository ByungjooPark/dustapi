/**
 * @file configs/winston.config.js
 * @description winston 설정 파일
 * 251011 v1.0 meerkat
 */

import dayjs from 'dayjs';
import winston from 'winston';

const now = dayjs().locale(process.env.APP_TZ).format('YYYYMMDD');

// 커스텀 포맷 작성
const logFormat = winston.format.printf(({message, level}) => {
    const timestamp = dayjs().locale(process.env.APP_TZ).format('YYYY-MM-DD HH:mm:ss');
    return `[${timestamp}] ${level} - ${message}`;
});

// 범용 로거 인스턴스
export const logger = winston.createLogger({
    level: process.env.APP_LOG_ERROR_LEVEL,
    format: winston.format.combine(
        winston.format.timestamp({format: 'YYYY-MM-dd HH:mm:ss'}),
        logFormat // 작성한 커스텀 포맷 사용
    ),
    transports: [
        // 로그레벨이 error인 경우
        new winston.transports.File({
            filename: `${process.env.APP_LOG_ERROR_PATH}/${now}_${process.env.APP_LOG_ERROR_FILE_NAME}`
        })
    ]
});

// morgan용 로거 인스턴스
export const httpLogger = winston.createLogger({
    level: process.env.APP_LOG_HTTP_LEVEL,
    format: winston.format.combine(
      winston.format.printf(({message}) => message)
    ),
    transports: [
        // 로그 레벨이 http인 경우
        new winston.transports.File({
            filename: `${process.env.APP_LOG_HTTP_PATH}/${now}_${process.env.APP_LOG_HTTP_FILE_NAME}`
        })
    ]
});