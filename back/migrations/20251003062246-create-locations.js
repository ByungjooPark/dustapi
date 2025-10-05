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
        autoIncrement: false,
        comment: '권역 고유 ID',
      },
      district_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '발령 지역명',
      },
      move_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '발령 권역명',
      },
      region_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: '행정 구역명',
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE
    }

    const options = {
      charset: 'utf8mb4',             // 테이블 문자셋 설정 (이모지 포함 지원)
      collate: 'utf8mb4_general_ci',  // 정렬 방식 (일반적 정렬 규칙)
      engine: 'InnoDB',                // 사용 엔진 지정
      comment: '권역 정보 테이블',
    }

    await queryInterface.createTable(
      'locations',
      attributes,
      options
    );
  },

  // 마이그레이션 롤백 시 호출됨 (테이블 제거)
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('locations');
  }
};