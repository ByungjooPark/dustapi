/**
 * @file migrations/20251009234037-alter-add-idx-forecast_images.js
 * @description forecast_images index 생성
 * 251008 v1.0 meerkat
 */

'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.addIndex('forecast_images', ['forecast_id'], {name: 'idx_forecast_images_forecast_id'});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('forecast_images', 'idx_forecast_images_forecast_id');
  }
};
