/**
 * @file migrations/20251009114037-alter-add-idx-forecasts.js
 * @description forecasts index 생성
 * 251008 v1.0 meerkat
 */

'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.addIndex('forecasts', ['inform_date'], {name: 'idx_forecasts_inform_date'});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('forecasts', 'idx_forecasts_inform_date');
  }
};
