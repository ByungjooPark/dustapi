/**
 * @file repositories/Forecast.repository.js
 * @description Forecast repository 파일
 * 251008 v1.0 meerkat
 */

import db from '../db_index.js';

const { Forecast, ForecastImage } = db;

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