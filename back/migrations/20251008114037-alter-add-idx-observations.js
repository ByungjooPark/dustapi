/**
 * @file migrations/20251008114037-alter-add-idx-observations.js
 * @description observations index 생성
 * 251008 v1.0 meerkat
 */

'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.addIndex('observations', ['data_time'], {name: 'idx_observations_data_time'});
    await queryInterface.addIndex('observations', ['station_code'], {name: 'idx_observations_station_code'});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('observations', 'idx_observations_data_time');
    await queryInterface.removeIndex('observations', 'idx_observations_station_code');
  }
};
