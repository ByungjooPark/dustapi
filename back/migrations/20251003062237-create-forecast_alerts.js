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
        comment: '경보 고유 ID',
      },
      sn: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        comment: '관리번호',
      },
      data_date: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '발령일',
      },
      location_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        comment: '행정구역 ID (FK -> locations.id)',
      },
      item_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '항목명 (PM10, PM25 등)',
      },
      issue_gbn: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '경보단계 (주의보, 경보 등)',
      },
      issue_date: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '발령일자',
      },
      issue_val: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '발령농도 (㎍/m3)',
      },
      clear_date: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '해제일자',
      },
      clear_val: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '해제 시 측정농도 (㎍/m3)',
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE
    }

    const options = {
      charset: 'utf8mb4',             // 테이블 문자셋 설정 (이모지 포함 지원)
      collate: 'utf8mb4_general_ci',  // 정렬 방식 (일반적 정렬 규칙)
      engine: 'InnoDB',                // 사용 엔진 지정
      comment: '경보/발령 정보 테이블',
    }

    await queryInterface.createTable(
      'forecast_alerts',
      attributes,
      options
    );
  },

  // 마이그레이션 롤백 시 호출됨 (테이블 제거)
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('forecast_alerts');
  }
};