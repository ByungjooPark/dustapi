import { query } from 'express-validator';

// serviceKey: 필수, 환경변수와 일치해야 함
export const serviceKey = query('serviceKey')
  .custom((val) =>{
    return val === process.env.DUST_API_SERVICEKEY;
  });

// returnType: 선택, 기본값 xml/json만 허용
export const returnType = query('returnType')
  .optional()
  .isIn(['xml', 'json'])
  .withMessage('returnType은 xml 또는 json이어야 합니다.');

// numOfRows: 선택, 숫자, 기본 100
export const numOfRows = query('numOfRows')
    .optional()
    .isInt({ min: 1 })
    .withMessage('numOfRows는 1 이상의 정수여야 합니다.');

// pageNo: 선택, 숫자, 기본 1
export const pageNo = query('pageNo')
    .optional()
    .isInt({ min: 1 })
    .withMessage('pageNo는 1 이상의 정수여야 합니다.');

// year: 필수, 4자리 숫자
export const year = query('year')
  .exists().withMessage('year 파라미터가 필요합니다.')
  .bail()
  .matches(/^\d{4}$/)
  .withMessage('year는 4자리 숫자여야 합니다.');

// itemCode: 선택, PM10 또는 PM25만 허용 (생략 가능)
export const itemCode = query('itemCode')
  .optional()
  .isIn(['PM10', 'PM25'])
  .withMessage('itemCode는 PM10 또는 PM25만 허용됩니다.');