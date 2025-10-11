/**
 * @file routes/arpltnInforInqireSvc.router.js
 * @description arpltnInforInqireSvc 라우터 파일
 * 251007 v1.0 meerkat
 */

import express from 'express';
import getMsrstnAcctoRltmMesureDnstyValidator from '../validations/arpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty.validator.js';
import validationHandler from '../validations/validationHandler.js';
import getUnityAirEnvrnIdexSnstiveAboveMsrstnListValidator from '../validations/arpltnInforInqireSvc/getUnityAirEnvrnIdexSnstiveAboveMsrstnList.validator.js';
import getCtprvnRltmMesureDnstyValidator from '../validations/arpltnInforInqireSvc/getCtprvnRltmMesureDnsty.validator.js';
import getMinuDustFrcstDspthValidator from '../validations/arpltnInforInqireSvc/getMinuDustFrcstDspth.validator.js';
import getMinuDustWeekFrcstDspthValidator from '../validations/arpltnInforInqireSvc/getMinuDustWeekFrcstDspth.validator.js';
import { ctprvnRltmMesureDnsty, minuDustFrcstDspth, msrstnAcctoRltmMesureDnsty } from '../controllers/arpltnInforInqireSvc.controller.js';
import { createProcessTimer } from '../middlewares/common.middleware.js';

const router = express.Router();

// 측정소별 실시간 측정정보 조회
router.get('/getMsrstnAcctoRltmMesureDnsty', createProcessTimer('/getMsrstnAcctoRltmMesureDnsty'), getMsrstnAcctoRltmMesureDnstyValidator, validationHandler, msrstnAcctoRltmMesureDnsty);

// 통합대기환경지수 나쁨 이상 측정소 목록조회
router.get('/getUnityAirEnvrnIdexSnstiveAboveMsrstnList', createProcessTimer('/getUnityAirEnvrnIdexSnstiveAboveMsrstnList'), getUnityAirEnvrnIdexSnstiveAboveMsrstnListValidator, validationHandler, (req, res) => {
  res.send('getUnityAirEnvrnIdexSnstiveAboveMsrstnList');
});

// 시도별 실시간 측정정보 조회
router.get('/getCtprvnRltmMesureDnsty', createProcessTimer('/getCtprvnRltmMesureDnsty'), getCtprvnRltmMesureDnstyValidator, validationHandler, ctprvnRltmMesureDnsty);

// 대기질 예보통보 조회
router.get('/getMinuDustFrcstDspth', createProcessTimer('/getMinuDustFrcstDspth'), getMinuDustFrcstDspthValidator, validationHandler, minuDustFrcstDspth);

// 초미세먼지 주간예보 조회
router.get('/getMinuDustWeekFrcstDspth', createProcessTimer('/getMinuDustWeekFrcstDspth'), getMinuDustWeekFrcstDspthValidator, validationHandler, (req, res) => {
  res.send('getMinuDustWeekFrcstDspth');
});

export default router;