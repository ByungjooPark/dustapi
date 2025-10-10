/**
 * @file repositories/observation.repository.js
 * @description observation repository 파일
 * 251008 v1.0 meerkat
 */
import { Op, Sequelize } from 'sequelize';
import db from '../db_index.js';

const { sequelize, Observation, Station } = db;

export const paginationObservations = async (t = null, params) => {
  const {limit, offset, startDate, endDate, stationName, sidoName} = params;

  const stationWhere = {};
  if(stationName) {
    stationWhere.stationName = stationName;
  }
  if(sidoName) {
    stationWhere.sidoName = sidoName;
  }

  return await Observation.findAndCountAll({
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
      where: stationWhere,
    }]
  });
}

export const averageToDateByDistrict = async (t = null, params) => {
  const {startDate, endDate} = params;

  return await Observation.findAll({
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
  });
}