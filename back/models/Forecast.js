/**
 * @file models/Forecast.js
 * @description Forecast 모델 파일
 * 251007 v1.0 meerkat
 */

import { DataTypes } from "sequelize";
import { dateFormatter } from "../utils/dateFormatter.util.js";

const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '예보 고유 ID',
  },
  dataTime: {
    field: 'data_time',
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '통보시간 (YYYY-MM-DD HH:mi)',
  },
  informCode: {
    field: 'inform_code',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '통보코드 (예: PM10)',
  },
  informOverall: {
    field: 'inform_overall',
    type: DataTypes.STRING(500),
    allowNull: false,
    comment: '예보개황',
  },
  informCause: {
    field: 'inform_cause',
    type: DataTypes.STRING(2000),
    allowNull: false,
    comment: '발생원인',
  },
  informGrade: {
    field: 'inform_grade',
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '예보등급',
  },
  actionKnack: {
    field: 'action_knack',
    type: DataTypes.STRING(2000),
    allowNull: false,
    comment: '행동요령',
  },
  informDate: {
    field: 'inform_date',
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '예측통보시간(YYYY-MM-DD)',
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
      const val = this.getDataValue('createdAt');
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
      const val = this.getDataValue('createdAt');
      if(!val) {
        return null;
      }
      return dateFormatter(val, 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss');
    }
  }
}

const options = {
  tableName: 'forecasts',
  timestamps: true,
  paranoid: true,
}

const Forecast = {
  init: sequelize => {
    const defineForecasts = sequelize.define(
      'Forecast',
      attributes,
      options
    );

    defineForecasts.prototype.toJSON = function() {
      const attributes = this.get();
      return attributes;
    }

    return defineForecasts;
  }
}

export default Forecast;