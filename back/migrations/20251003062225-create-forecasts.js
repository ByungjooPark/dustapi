'use strict';

import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export default {
  // 마이그레이션 실행 시 호출됨 (테이블 생성)
  async up (queryInterface, Sequelize) {
    const attributes = {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: '예보 고유 ID',
      },
      data_time: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '통보시간 (YYYY-MM-DD HH:mi)',
      },
      inform_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '통보코드 (예: PM10)',
      },
      inform_overall: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: '예보개황',
      },
      inform_cause: {
        type: DataTypes.STRING(2000),
        allowNull: false,
        comment: '발생원인',
      },
      inform_grade: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '예보등급',
      },
      action_knack: {
        type: DataTypes.STRING(2000),
        allowNull: false,
        comment: '행동요령',
      },
      inform_date: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '예측통보시간(YYYY-MM-DD)',
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE
    }

    const options = {
      charset: 'utf8mb4',             // 테이블 문자셋 설정 (이모지 포함 지원)
      collate: 'utf8mb4_general_ci',  // 정렬 방식 (일반적 정렬 규칙)
      engine: 'InnoDB',                // 사용 엔진 지정
      comment: '예보·통보 테이블',
    }

    await queryInterface.createTable(
      'forecasts',
      attributes,
      options
    );
  },

  // 마이그레이션 롤백 시 호출됨 (테이블 제거)
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('forecasts');
  }
};