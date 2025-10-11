/**
 * @file routes/msrstnInfoInqireSvc.router.js
 * @description 측정소정보 조회 서비스 라우터 파일
 * 251011 v1.0 meerkat
 */

import express from 'express';
import validationHandler from '../validations/validationHandler.js';
import getMsrstnListValidator from '../validations/msrstnInfoInqireSvc/getMsrstnList.validator.js';
import { msrstnList, nearbyMsrstnList, tmstdrCrdnt } from '../controllers/msrstnInfoInqireSvc.controller.js';
import getNearbyMsrstnListValidator from '../validations/msrstnInfoInqireSvc/getNearbyMsrstnList.validator.js';
import { createProcessTimer } from '../middlewares/common.middleware.js';


const router = express.Router();

// 측정소 목록 조회
router.get('/getMsrstnList', createProcessTimer('/getMsrstnList'), getMsrstnListValidator, validationHandler, msrstnList);

// 근접측정소 목록 조회
router.get('/getNearbyMsrstnList', createProcessTimer('/getNearbyMsrstnList'), getNearbyMsrstnListValidator, validationHandler, nearbyMsrstnList);

// TM 기준좌표 조회
router.get('/getTMStdrCrdnt', createProcessTimer('/getTMStdrCrdnt'), getMsrstnListValidator, validationHandler, tmstdrCrdnt);

export default router;