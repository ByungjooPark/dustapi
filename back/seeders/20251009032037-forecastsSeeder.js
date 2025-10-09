/**
 * @file seerders/20251009032037-forecastsSeeder.js
 * @description forecastsSeeder 시더 파일
 * 251009 v1.0 meerkat
 */

import dayjs from 'dayjs';
import db from '../db_index.js';
const {sequelize} = db;

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    // https://airkorea.or.kr/dustImage/2025/01/01/17/09km/AQF.20241231.NIER_09_01.PM10.2days.ani.gif_0.gif
    // https://airkorea.or.kr/dustImage/2025/01/01/17/09km/AQF.20241231.NIER_09_01.PM10.2days.ani.gif

    const START_DATE = '2025-01-01 00:00:00';
    const END_DATE = '2025-12-31 00:00:00';
    const INFORM_CODE = ['PM10', 'PM25', 'O3'];

    


    // await queryInterface.bulkInsert('forecasts', stations, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('forecasts', null, {});
  }
};
