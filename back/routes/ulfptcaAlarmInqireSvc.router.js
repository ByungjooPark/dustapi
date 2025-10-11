/**
 * @file routes/ulfptcaAlarmInqireSvc.router.js
 * @description ulfptcaAlarmInqireSvc 라우터 파일
 * 251007 v1.0 meerkat
 */

import express from 'express';
import getUlfptcaAlarmInfoValidator from '../validations/ulfptcaAlarmInqireSvc/getUlfptcaAlarmInfo.validator.js';
import validationHandler from '../validations/validationHandler.js';
import { ulfptcaAlarmInfo } from '../controllers/ulfptcaAlarmInqireSvc.controller.js';

const router = express.Router();

// 미세먼지 경보 현황 정보 조회
router.get('/getUlfptcaAlarmInfo', getUlfptcaAlarmInfoValidator, validationHandler, ulfptcaAlarmInfo);

export default router;