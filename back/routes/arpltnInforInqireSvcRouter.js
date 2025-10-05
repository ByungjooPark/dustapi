import express from 'express';
import getMsrstnAcctoRltmMesureDnstyValidator from '../validations/arpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnstyValidator.js';
import validationHandler from '../validations/validationHandler.js';
import getUnityAirEnvrnIdexSnstiveAboveMsrstnListValidator from '../validations/arpltnInforInqireSvc/getUnityAirEnvrnIdexSnstiveAboveMsrstnListValidator.js';
import getCtprvnRltmMesureDnstyValidator from '../validations/arpltnInforInqireSvc/getCtprvnRltmMesureDnstyValidator.js';
import getMinuDustFrcstDspthValidator from '../validations/arpltnInforInqireSvc/getMinuDustFrcstDspthValidator.js';
import getMinuDustWeekFrcstDspthValidator from '../validations/arpltnInforInqireSvc/getMinuDustWeekFrcstDspthValidator.js';

const router = express.Router();

// 측정소별 실시간 측정정보 조회
router.get('/getMsrstnAcctoRltmMesureDnsty', getMsrstnAcctoRltmMesureDnstyValidator, validationHandler, (req, res) => {
res.send('getMsrstnAcctoRltmMesureDnsty');
});

// 통합대기환경지수 나쁨 이상 측정소 목록조회
router.get('/getUnityAirEnvrnIdexSnstiveAboveMsrstnList', getUnityAirEnvrnIdexSnstiveAboveMsrstnListValidator, validationHandler, (req, res) => {
  res.send('getUnityAirEnvrnIdexSnstiveAboveMsrstnList');
});

// 시도별 실시간 측정정보 조회
router.get('/getCtprvnRltmMesureDnsty', getCtprvnRltmMesureDnstyValidator, validationHandler, (req, res) => {
  res.send('getCtprvnRltmMesureDnsty');
});

// 대기질 예보통보 조회
router.get('/getMinuDustFrcstDspth', getMinuDustFrcstDspthValidator, validationHandler, (req, res) => {
  res.send('getMinuDustFrcstDspth');
});

// 초미세먼지 주간예보 조회
router.get('/getMinuDustWeekFrcstDspth', getMinuDustWeekFrcstDspthValidator, validationHandler, (req, res) => {
  res.send('getMinuDustWeekFrcstDspth');
});

export default router;