/**
 * @file models/ForecastAlert.js
 * @description ForecastAlert 모델 파일
 * 251010 v1.0 meerkat
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
    comment: '경보 고유 ID',
  },
  sn: {
    field: 'sn',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '관리번호',
  },
  dataDate: {
    field: 'data_date',
    type: DataTypes.DATE,
    allowNull: false,
    comment: '발령일',
    get() {
      const val = this.getDataValue('dataDate');
      if(!val) {
        return null;
      }
      return dateFormatter(val, 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss');
    }
  },
  locationId: {
    field: 'location_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '행정구역 ID (FK -> locations.id)',
  },
  itemCode: {
    field: 'item_code',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '항목명 (PM10, PM25, O3 등)',
  },
  issueGbn: {
    field: 'issue_gbn',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '경보단계 (주의보, 경보 등)',
  },
  issueDate: {
    field: 'issue_date',
    type: DataTypes.DATE,
    allowNull: false,
    comment: '발령일자',
    get() {
      const val = this.getDataValue('issueDate');
      if(!val) {
        return null;
      }
      return dateFormatter(val, 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss');
    }
  },
  issueVal: {
    field: 'issue_val',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '발령농도 (㎍/m3)',
  },
  clearDate: {
    field: 'clear_date',
    type: DataTypes.DATE,
    allowNull: false,
    comment: '해제일자',
    get() {
      const val = this.getDataValue('clearDate');
      if(!val) {
        return null;
      }
      return dateFormatter(val, 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss');
    }
  },
  clearVal: {
    field: 'clear_val',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '해제 시 측정농도 (㎍/m3)',
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
  tableName: 'forecast_alerts',
  timestamps: true,
  paranoid: true,
}

const forecastAlert = {
  init: sequelize => {
    const defineForecastAlerts = sequelize.define(
      'forecastAlerts',
      attributes,
      options
    );

    defineForecastAlerts.prototype.toJSON = function() {
      const attributes = this.get();
      return attributes;
    }

    return defineForecastAlerts;
  }
}

export default forecastAlert;