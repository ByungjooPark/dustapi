'use strict';

import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export default {
  // 마이그레이션 실행 시 호출됨 (테이블 생성)
  async up (queryInterface, Sequelize) {
    const attributes = {
      station_code: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: '측정소 코드 (PK)',
      },
      station_name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        comment: '측정소명',
      },
      address: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: '측정소 주소',
      },
      sido_name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '시도',
      },
      sgg_name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '시군구',
      },
      umd_name: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '읍면동',
      },
      mang_name: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '측정망 정보 (도시대기, 도로변대기, 국가배경농고, 교외대기, 항만)',
      },
      tm_x: {
        type: DataTypes.STRING(10),
        allowNull: true,
        comment: 'TM방식 X좌표',
      },
      tm_y: {
        type: DataTypes.STRING(10),
        allowNull: true,
        comment: 'TM방식 y좌표',
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE
    }

    const options = {
      charset: 'utf8mb4',             // 테이블 문자셋 설정 (이모지 포함 지원)
      collate: 'utf8mb4_general_ci',  // 정렬 방식 (일반적 정렬 규칙)
      engine: 'InnoDB',                // 사용 엔진 지정
      comment: '측정소 기본 정보 테이블',
    }

    await queryInterface.createTable(
      'stations',
      attributes,
      options
    );
  },

  // 마이그레이션 롤백 시 호출됨 (테이블 제거)
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('stations');
  }
};