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
        comment: '관측값 고유 ID',
      },
      station_code: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        comment: '측정소 코드 (FK -> stations.station_code)',
      },
      data_time: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '측정일시 (YYYY-MM-DD HH:MM)',
      },
      so2_value: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '아황산가스 농도 (ppm)',
      },
      co_value: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '일산화탄소 농도 (ppm)',
      },
      o3_value: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '오존 농도 (ppm)',
      },
      no2_value: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '이산화질소 농도 (ppm)',
      },
      pm10_value: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '미세먼지(PM10) 농도 (㎍/㎥)',
      },
      pm10_value_24: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'PM10 24시간예측 이동농도 (㎍/㎥)',
      },
      pm25_value: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '미세먼지(PM2.5) 농도 (㎍/㎥)',
      },
      pm25_value_24: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'PM2.5 24시간예측 이동농도 (㎍/㎥)',
      },
      khai_value: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '통합대기환경수치',
      },
      khai_grade: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '통합대기환경지수 등급',
      },
      so2_grade: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '아황산가스 등급',
      },
      co_grade: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '일산화탄소 등급',
      },
      o3_grade: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '오존 등급',
      },
      no2_grade: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '이산화질소 등급',
      },
      pm10_grade: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'PM10 등급',
      },
      pm25_grade: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'PM2.5 등급',
      },
      pm10_grade_1h: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'PM10 1시간 등급',
      },
      pm25_grade_1h: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'PM2.5 1시간 등급',
      },
      so2_flag: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '아황산가스 측정자료 상태정보',
      },
      co_flag: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '일산화탄소 측정자료 상태정보',
      },
      o3_flag: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '오존 측정자료 상태정보',
      },
      no2_flag: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '이산화질소 측정자료 상태정보',
      },
      pm10_flag: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'PM10 측정자료 상태정보',
      },
      pm25_flag: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'PM2.5 측정자료 상태정보',
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE,
    }

    const options = {
      charset: 'utf8mb4',             // 테이블 문자셋 설정 (이모지 포함 지원)
      collate: 'utf8mb4_general_ci',  // 정렬 방식 (일반적 정렬 규칙)
      engine: 'InnoDB',                // 사용 엔진 지정
      comment: '시간별 관측치 (대기오염 측정값/지수/플래그) 테이블',
    }

    await queryInterface.createTable(
      'observations',
      attributes,
      options
    );
  },

  // 마이그레이션 롤백 시 호출됨 (테이블 제거)
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('observations');
  }
};