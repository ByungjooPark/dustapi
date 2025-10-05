'use strict';
import locations from './baseData/locations.js';

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