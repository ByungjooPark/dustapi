/**
 * @file models/Stations.js
 * @description Stations 모델 파일
 * 251007 v1.0 meerkat
 */

import { DataTypes } from "sequelize";

const attributes = {
  stationCode: {
    field: 'station_code',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '측정소 코드 (PK)',
  },
  locationId: {
    field: 'location_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '권역 고유 ID (FK -> location.id)',
  },
  stationName: {
    field: 'station_name',
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: '측정소명',
  },
  address: {
    field: 'address',
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: '측정소 주소',
  },
  sidoFullname: {
    field: 'sido_fullname',
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '시도명전체',
  },
  sidoName: {
    field: 'sido_name',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '시도명',
  },
  mangName: {
    field: 'mang_name',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '측정망 정보',
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
  tableName: 'Stations',
  timestamps: true,
  paranoid: true,
}

const Stations = {
  init: sequelize => {
    const defineStations = sequelize.define(
      'Stations',
      attributes,
      options
    );

    defineStations.prototype.toJSON = function() {
      const attributes = this.get();
      return attributes;
    }

    return defineStations;
  }
}

export default Stations;