/**
 * @file models/Observations.js
 * @description Observations 모델 파일
 * 251007 v1.0 meerkat
 */

import { DataTypes } from "sequelize";

const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '관측값 고유 ID',
  },
  stationCode: {
    field: 'station_code',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '측정소 코드 (FK -> stations.station_code)',
  },
  dataTime: {
    field: 'data_time',
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '측정일시 (YYYY-MM-DD HH:MM)',
  },
  so2Value: {
    field: 'so2_value',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '아황산가스 농도 (ppm)',
  },
  coValue: {
    field: 'co_value',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '일산화탄소 농도 (ppm)',
  },
  o3Value: {
    field: 'o3_value',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '오존 농도 (ppm)',
  },
  no2Value: {
    field: 'no2_value',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '이산화질소 농도 (ppm)',
  },
  pm10Value: {
    field: 'pm10_value',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '미세먼지(PM10) 농도 (㎍/㎥)',
  },
  pm10Value24: {
    field: 'pm10_value_24',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'PM10 24시간예측 이동농도 (㎍/㎥)',
  },
  pm25Value: {
    field: 'pm25_value',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '미세먼지(PM2.5) 농도 (㎍/㎥)',
  },
  pm25Value24: {
    field: 'pm25_value_24',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'PM2.5 24시간예측 이동농도 (㎍/㎥)',
  },
  khaiValue: {
    field: 'khai_value',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '통합대기환경지수',
  },
  khaiCode: {
    field: 'khai_code',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '통합대기환경지수 항목',
  },
  khaiGrade: {
    field: 'khai_grade',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '통합대기환경지수 등급',
  },
  so2Grade: {
    field: 'so2_grade',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '아황산가스 등급',
  },
  coGrade: {
    field: 'co_grade',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '일산화탄소 등급',
  },
  o3Grade: {
    field: 'o3_grade',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '오존 등급',
  },
  no2Grade: {
    field: 'no2_grade',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '이산화질소 등급',
  },
  pm10Grade: {
    field: 'pm10_grade',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'PM10 등급',
  },
  pm25Grade: {
    field: 'pm25_grade',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'PM2.5 등급',
  },
  pm10Grade1h: {
    field: 'pm10_grade_1h',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'PM10 1시간 등급',
  },
  pm25Grade1h: {
    field: 'pm25_grade_1h',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'PM2.5 1시간 등급',
  },
  so2Flag: {
    field: 'so2_flag',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '아황산가스 측정자료 상태정보',
  },
  coFlag: {
    field: 'co_flag',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '일산화탄소 측정자료 상태정보',
  },
  o3Flag: {
    field: 'o3_flag',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '오존 측정자료 상태정보',
  },
  no2Flag: {
    field: 'no2_flag',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '이산화질소 측정자료 상태정보',
  },
  pm10Flag: {
    field: 'pm10_flag',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'PM10 측정자료 상태정보',
  },
  pm25Flag: {
    field: 'pm25_flag',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'PM2.5 측정자료 상태정보',
  },
  createdAt: {
      field: 'created_at'
      ,type: DataTypes.DATE
  }
  ,updatedAt: {
      field: 'updated_at'
      ,type: DataTypes.DATE
  }
  ,deletedAt: {
      field: 'deleted_at'
      ,type: DataTypes.DATE
  }
}

const options = {
  tableName: 'Observations',
  timestamps: true,
  paranoid: true,
}

const Observations = {
  init: sequelize => {
    const defineObservations = sequelize.define(
      'Observations',
      attributes,
      options
    );

    defineObservations.prototype.toJSON = function() {
      const attributes = this.get();
      return attributes;
    }

    return defineObservations;
  }
}

export default Observations;