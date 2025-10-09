/**
 * @file seerders/20251003102859-locationsSeeder.js
 * @description locationsSeeder 시더 파일
 * 251007 v1.0 meerkat
 */

import locations from './base/processing/locations.js';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'locations',
      locations
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('locations', null, {});
  }
};