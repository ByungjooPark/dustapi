/**
 * @file repositories/location.repository.js
 * @description location repository 파일
 * 251010 v1.0 meerkat
 */

import db from '../db_index.js';

const { Location } = db;

/**
 * 모든 Location을 배열로 획득
 * 
 * @param {Sequelize.transaction} t  
 * @returns {import('sequelize').Model<Location>[]}
 */
export const getAllLocations = async (t = null) => {
  return await Location.findAll(
    {
      raw: true,
    },
    { transaction: t },
  );
}