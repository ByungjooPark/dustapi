/**
 * @file middlewares/common.middleware.js
 * @description common middleware 파일
 * 251011 v1.0 meerkat
 */

/**
 * 요청 처리시간 획득
 * @param {string} label 
 * @returns 
 */
export const createProcessTimer = (label) => {
  return (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${label}] ${duration}ms`);
    });

    next();
  };
};