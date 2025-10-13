/**
 * @file configs/cors.config
 * @description cors 설정 파일
 * 251013 v1.0 meerkat
 */

export const corsConfig = {
  origin: [
    'http://localhost:*',
    'https://app12.green-meerkat.kro.kr'
  ],
  methods: ['GET'],
  credentials: true,
}