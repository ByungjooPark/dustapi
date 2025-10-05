'use strict';
import stations from './baseData/stations.js';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('stations', stations, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('stations', null, {});
  }
};