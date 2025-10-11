/**
 * @file repositories/forecastAlert.repository.js
 * @description forecastAlert repository 파일
 * 251011 v1.0 meerkat
 */

import { Op, Sequelize } from 'sequelize';
import db from '../db_index.js';

const { ForecastAlert, Location } = db;

/**
 * Forecast 페이지네이션
 * 
 * @param {Sequelize.transaction} t 
 * @param {{limit: number, offset: number, startDate: string, endDate: string, itemCode: string}} params 
 * @returns {import('sequelize').Model<ForecastAlert>[]}
 */
export async function paginationForecastAlert(t= null, params) {
  const {limit, offset, itemCode, startDate, endDate} = params;

  // where절 생성
  const whereClause = {}
  whereClause.dataDate = {
    [Op.between]: [startDate, endDate],
  }
  
  if(itemCode) {
    whereClause.itemCode = itemCode;
  }

  const options ={
    where: whereClause,
    order: [
      ['dataDate', 'ASC'],
      ['item_code', 'ASC'],
    ],
  };

  // 카운트 별도 획득
  const count = await ForecastAlert.count(options, { transaction: t });

  options.include = [{
    model: Location,
    limit: limit, // limit가 추가되면 Sequelize는 내부적으로 separate=true로 처리하려 하로 다:1 관계에서 에러발생
    offset: offset,
    separate: false, // separate = false 지정해서 에러 회피
  }];

  // 데이터 획득
  const rows = await ForecastAlert.findAll(options, { transaction: t });

  return {count, rows};
}