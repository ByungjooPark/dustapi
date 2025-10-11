/**
 * @file repositories/station.repository.js
 * @description station repository 파일
 * 251011 v1.0 meerkat
 */

import { Sequelize } from 'sequelize';
import db from '../db_index.js';

const { Station } = db;

/**
 * Station 페이지네이션 획득
 * 
 * @param {Sequelize.transaction} t 
 * @param {{limit: number, offset: number, addr: string, stationName: string}} params 
 * @returns {import('sequelize').Model<Station>[]}
 */
export async function paginationMsrstnListByAddr(t = null, params) {
  const {limit, offset, addr, stationName} = params;

  const stationWhere = {}
  if(addr) {
    stationWhere.sidoName = addr;
  } else if(stationName) {
    stationWhere.stationName = stationName;
  }

  return await Station.findAndCountAll(
    {
      where: stationWhere,
      limit: limit,
      offset: offset,
      order: [
        ['stationCode', 'ASC'],
        ['stationName', 'ASC']
      ],
    },
    { transaction: t },
  );
}

/**
 * 특정 위도, 경도로 가장 가까운 측정소 리스트 10곳 획득
 * 
 * @param {Sequelize.transaction} t 
 * @param {{tmX: string, tmY: string}} params 
 * @returns {import('sequelize').Model<Station>[]}
 */
export async function getMsrstnListByTm(t = null, params) {
  const {tmX, tmY} = params;

  return await Station.findAll(
    {
      attributes: [
        'station_code',
        'Station_name',
        'address',
        [
          Sequelize.literal(`
            ROUND(
              6371 * ACOS(
                COS(RADIANS(${tmY})) * COS(RADIANS(tm_y)) * COS(RADIANS(tm_x) - RADIANS(${tmX})) + SIN(RADIANS(${tmY})) * SIN(RADIANS(tm_y))
              ),
              1
            )
          `),
          'tm'
        ]
      ],
      order: [[Sequelize.literal('tm'), 'ASC']],
      limit: 10,
      raw: true,
    },
    { transaction: t },
  );
}