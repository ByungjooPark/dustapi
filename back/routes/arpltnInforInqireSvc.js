import express from 'express';

const router = express.Router();

// 측정소별 실시간 측정정보 조회
router.get('/getMsrstnAcctoRltmMesureDnsty', (req, res) => {
res.send('getMsrstnAcctoRltmMesureDnsty');
});

// 통합대기환경지수 나쁨 이상 측정소 목록조회
router.get('/getUnityAirEnvrnIdexSnstiveAboveMsrstnList', (req, res) => {
  res.send('getUnityAirEnvrnIdexSnstiveAboveMsrstnList');
});

// 시도별 실시간 측정정보 조회
router.get('/getCtprvnRltmMesureDnsty', (req, res) => {
  res.send('getCtprvnRltmMesureDnsty');
});

// 대기질 예보통보 조회
router.get('/getMinuDustFrcstDspth', (req, res) => {
  res.send('getMinuDustFrcstDspth');
});

// 초미세먼지 주간예보 조회
router.get('/getMinuDustWeekFrcstDspth', (req, res) => {
  res.send('getMinuDustWeekFrcstDspth');
});

export default router;