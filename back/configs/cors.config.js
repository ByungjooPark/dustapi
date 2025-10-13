/**
 * @file configs/cors.config
 * @description cors 설정 파일
 * 251013 v1.0 meerkat
 */

const allowedOrigins = [
  'http://localhost:5173',
  'https://app12.green-meerkat.kro.kr'
];

export const corsConfig = {
  origin: function (origin, callback) {
    // origin이 없거나(e.g. Postman), 허용된 목록에 있으면
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // 허용
    } else {
      callback(new Error('Not allowed by CORS')); // 거부
    }
  },
  methods: ['GET', 'OPTIONS'],
  credentials: true,
}