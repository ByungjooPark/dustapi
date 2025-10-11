/**
 * @file repositories/Forecast.repository.js
 * @description Forecast repository 파일
 * 251008 v1.0 meerkat
 */

import { Op, Sequelize } from 'sequelize';
import db from '../db_index.js';

const { Forecast, ForecastImage } = db;

/**
 * Forecast 페이지네이션
 * 
 * @param {Sequelize.transaction} t 
 * @param {{limit: number, offset: number, informCode: string, searchDateList: string[], searchDate: string}} params 
 * @returns {import('sequelize').Model<Forecast>[]}
 */
export const paginationForecast = async (t= null, params) => {
  const {limit, offset, informCode, searchDateList, searchDate} = params;

  // where절 생성
  const whereClause = {}
  whereClause.dataTime = {
    [Op.in]: searchDateList,
  }
  
  if(informCode) {
    whereClause.informCode = informCode;
  }

  const options ={
    where: whereClause,
    order: [
      ['informCode', 'ASC'],
      ['dataTime', 'ASC'],
    ],
    
  };

  // 카운트 별도 획득 (1:n 관계라 findAndCountAll은 부정확)
  const count = await Forecast.count(options, { transaction: t });

  options.include = [{
    model: ForecastImage,
    order: [
      ['position', 'ASC'],
    ]
  }];

  // 페이지네이션 설정(searchDate 있을 시 미설정)
  if(searchDate) {
    options.limit = limit;
    options.offset = offset;
  }

  const rows = await Forecast.findAll(options, { transaction: t });

  return {count, rows};
}

/**
 * 모든 Forecast 획득
 * 
 * @param {Sequelize.transaction} t 
 * @returns {import('sequelize').Model<Forecast>[]}
 */
export const getAllForecast = async (t= null) => {
  return await Forecast.findAll(
    {
      order: [
        ['dataTime', 'ASC'],
        ['id', 'ASC']
      ],
      include: [{
        model: ForecastImage
      }]
    },
    { transaction: t },
  );
}