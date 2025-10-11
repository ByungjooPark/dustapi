/**
 * @file repositories/observation.repository.js
 * @description observation repository 파일
 * 251008 v1.0 meerkat
 */

import { Op, Sequelize } from 'sequelize';
import db from '../db_index.js';

const { Observation, Station } = db;

/**
 * Observation 페이지네이션
 * 
 * @param {Sequelize.transaction} t 
 * @param {{limit: number, offset: number, startDate: string, endDate: string, stationName: string, stationName: sidoName}} params 
 * @returns {import('sequelize').Model<Observation>[]}
 */
export const paginationObservations = async (t = null, params) => {
  const {limit, offset, startDate, endDate, stationName, sidoName} = params;

  const whereClauseStation = {};
  if(stationName) {
    whereClauseStation.stationName = stationName;
  }
  if(sidoName) {
    whereClauseStation.sidoName = sidoName;
  }
  
  return await Observation.findAndCountAll(
    {
      where: {
        dataTime: {
          [Op.between]: [startDate, endDate]
        }
      },
      limit: limit,
      offset: offset,
      order: [
        ['dataTime', 'ASC'],
        ['stationCode', 'ASC']
      ],
      include: [{
        model: Station,
        required: true,
        where: whereClauseStation,
      }]
    },
    { transaction: t },
  );
}

/**
 * 특정 일 오염물질 별 평균을 배열로 획득
 * 
 * @param {Sequelize.transaction} t 
 * @param {{startDate: string, endDate: string}} params 
 * @returns {import('sequelize').Model<Observation>[]}
 */
export const averageToDateByDistrict = async (t = null, params) => {
  const {startDate, endDate} = params;

  return await Observation.findAll(
    {
      attributes: [
        [Sequelize.col('Station.sido_name'), 'sidoName'],
        [Sequelize.fn('AVG', Sequelize.col('Observation.o3_value')), 'avgO3'],
        [Sequelize.fn('AVG', Sequelize.col('Observation.pm10_value')), 'avgPm10'],
        [Sequelize.fn('AVG', Sequelize.col('Observation.pm25_value')), 'avgPm25'],
      ],
      include: [
        {
          model: Station,
          required: true,
          attributes: [],
        }
      ],
      where: {
        dataTime: {
          [Op.between]: [startDate, endDate],
        }
      },
      group: ['Station.sido_name'],
      raw: true,
    },
    { transaction: t },
  );
}

/**
 * 특정 Location의 특정 하루 오염물질 별 평균을 배열로 획득
 * 
 * @param {Sequelize.transaction} t 
 * @param {{locId: number, startDate: string, endDate: string}} params 
 * @returns {import('sequelize').Model<Observation>[]}
 */
export const averageToDateByLocation = async (t = null, params) => {
  const {locId, startDate, endDate} = params;

  return await Observation.findAll(
    {
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('Observation.o3_value')), 'avgO3'],
        [Sequelize.fn('AVG', Sequelize.col('Observation.pm10_value')), 'avgPm10'],
        [Sequelize.fn('AVG', Sequelize.col('Observation.pm25_value')), 'avgPm25'],
      ],
      include: [
        {
          model: Station,
          required: true,
          attributes: [],
          where: {
            locationId: locId
          }
        }
      ],
      where: {
        dataTime: {
          [Op.in]: [startDate, endDate],
        }
      },
      group: ['Observation.data_time'],
      raw: true,
    },
    { transaction: t },
  );
}