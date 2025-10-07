/**
 * @file controllers/arpltnInforInqireSvc.controller.js
 * @description arpltnInforInqireSvc 컨트롤러 파일
 * 251007 v1.0 meerkat
 */

import { SUCCESS } from "../configs/responseCode.config.js";
import { createbaseResponseDTO } from "../dto/baseResponse.dto.js";

export const getMsrstnAcctoRltmMesureDnsty = (req, res) => {

  
  return res
    .status(SUCCESS.status)
    .send(createbaseResponseDTO.dto(SUCCESS, 'test'));
}