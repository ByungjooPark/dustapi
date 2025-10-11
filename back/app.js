/**
 * @file app.js
 * @description Entry Point 파일
 * 251007 v1.0 meerkat
 */

import express from 'express'; // express 모듈을 가져오기
import './configs/envConfig.js';
import routerArpltnInforInqireSvc from './routes/arpltnInforInqireSvc.router.js';
import reuterUlfptcaAlarmInqireSvc from './routes/ulfptcaAlarmInqireSvc.router.js';
import reuterMsrstnInfoInqireSvc from './routes/msrstnInfoInqireSvc.router.js'
import { NOT_FOUND_ERROR } from './configs/responseCode.config.js';
import errorHandler from './errors/errorHandler.js';
import { commonError } from './errors/common.error.js';

const app = express(); // Express 애플리케이션 인스턴스를 생성

app.use('/B552584/ArpltnInforInqireSvc', routerArpltnInforInqireSvc);
app.use('/B552584/UlfptcaAlarmInqireSvc', reuterUlfptcaAlarmInqireSvc);
app.use('/B552584/MsrstnInfoInqireSvc', reuterMsrstnInfoInqireSvc);

// Not Found
app.use((req, res, next) => {
  next(commonError(NOT_FOUND_ERROR, 'NOT FOUND ERROR'));
});

// Error Handler
app.use(errorHandler);

// 서버를 주어진 포트에서 시작
app.listen(3000, () => {
    console.log(`${3000} 포트 리스닝`);
});