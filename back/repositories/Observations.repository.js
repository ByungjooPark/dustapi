/**
 * @file services/arpltnInforInqireSvc.repository.js
 * @description arpltnInforInqireSvc repository 파일
 * 251008 v1.0 meerkat
 */
import { Op } from 'sequelize';
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
      where: stationWhere,
    }]
  });
}