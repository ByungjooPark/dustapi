/**
 * @file models/Station.js
 * @description Station 모델 파일
 * 251007 v1.0 meerkat
 */

import { DataTypes } from "sequelize";
import { dateFormatter } from "../utils/dateFormatter.util.js";

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
  tmX: {
    field: 'tm_x',
    type: DataTypes.STRING(13),
    allowNull: true,
    comment: 'TM방식 X좌표',
  },
  tmY: {
    field: 'tm_y',
    type: DataTypes.STRING(13),
    allowNull: true,
    comment: 'TM방식 y좌표',
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    get() {
      const val = this.getDataValue('createdAt');
      if(!val) {
        return null;
      }
      return dateFormatter(val, 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss');
    }
  }
  ,updatedAt: {
    field: 'updated_at',
    type: DataTypes.DATE,
    get() {
      const val = this.getDataValue('updatedAt');
      if(!val) {
        return null;
      }
      return dateFormatter(val, 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss');
    }
  }
  ,deletedAt: {
    field: 'deleted_at',
    type: DataTypes.DATE,
    get() {
      const val = this.getDataValue('deletedAt');
      if(!val) {
        return null;
      }
      return dateFormatter(val, 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss');
    }
  }
}

const options = {
  tableName: 'stations',
  timestamps: true,
  paranoid: true,
}

const Station = {
  init: sequelize => {
    const defineStations = sequelize.define(
      'Station',
      attributes,
      options
    );

    defineStations.prototype.toJSON = function() {
      const attributes = this.get();
      return attributes;
    }

    return defineStations;
  },
  associate: db => {
    db.Station.hasMany(db.Observation, {sourceKey: 'stationCode', foreignKey: 'stationCode'});
  }
}

export default Station;