import express from 'express';
import getUlfptcaAlarmInfoValidator from '../validations/ulfptcaAlarmInqireSvc/getUlfptcaAlarmInfoValidator.js';
import validationHandler from '../validations/validationHandler.js';


const router = express.Router();

// 미세먼지 경보 현황 정보 조회
router.get('/getUlfptcaAlarmInfo', getUlfptcaAlarmInfoValidator, validationHandler, (req, res) => {
  res.send('test');
});

export default router;