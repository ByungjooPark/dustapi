import express from 'express'; // express 모듈을 가져오기
import './configs/envConfig.js';
import routerArpltnInforInqireSvc from './routes/arpltnInforInqireSvc.js';
import reuterUlfptcaAlarmInqireSvc from './routes/ulfptcaAlarmInqireSvc.js';
import { BaseResponseDTO } from './dto/responseDTO/BaseResponseDTO.js';
import { responseCodeConfig } from './configs/responseCodeConfig.js';

const app = express(); // Express 애플리케이션 인스턴스를 생성

app.use('/B552584/ArpltnInforInqireSvc', routerArpltnInforInqireSvc);
app.use('/B552584/UlfptcaAlarmInqireSvc', reuterUlfptcaAlarmInqireSvc);

// Not Found
app.use((req, res) => {
  const responseCode = responseCodeConfig['12'];
  const baseResponseDTO = new BaseResponseDTO(responseCode.code, responseCode.msg);
  res.status(responseCode.status).send(baseResponseDTO.getResponse());
});

// 서버를 주어진 포트에서 시작
app.listen(3000, () => {
    console.log(`${3000} 포트 리스닝`);
});