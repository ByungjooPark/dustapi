/**
 * @file seerders/20251003113000-stationsSeeder.js
 * @description stationsSeeder 시더 파일
 * 251007 v1.0 meerkat
 */

import stations from './base/processing/stations.js';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('stations', stations, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('stations', null, {});
  }
};