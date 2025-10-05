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
        comment: '예보 이미지 고유 ID',
      },
      forecast_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        comment: '예보 ID (FK -> forecasts.id)',
      },
      position: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: '이미지 순번 (1~9)',
      },
      image_url: {
        type: DataTypes.STRING(600),
        allowNull: false,
        comment: '이미지 URL',
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE
    }

    const options = {
      charset: 'utf8mb4',             // 테이블 문자셋 설정 (이모지 포함 지원)
      collate: 'utf8mb4_general_ci',  // 정렬 방식 (일반적 정렬 규칙)
      engine: 'InnoDB',                // 사용 엔진 지정
      comment: '예보 이미지 테이블',
    }

    await queryInterface.createTable(
      'forecast_images',
      attributes,
      options
    );
  },

  // 마이그레이션 롤백 시 호출됨 (테이블 제거)
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('forecast_images');
  }
};