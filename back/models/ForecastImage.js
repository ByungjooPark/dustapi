/**
 * @file models/ForecastImage.js
 * @description ForecastImage 모델 파일
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
    comment: '예보 이미지 고유 ID',
  },
  forecastId: {
    field: 'forecast_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '예보 ID (FK -> forecasts.id)',
  },
  position: {
    field: 'position',
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: '이미지 순번 (1~9)',
  },
  imageUrl: {
    field: 'image_url',
    type: DataTypes.STRING(600),
    allowNull: false,
    comment: '이미지 URL',
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
  tableName: 'forecast_images',
  timestamps: true,
  paranoid: true,
}

const ForecastImage = {
  init: sequelize => {
    const defineForecastImages = sequelize.define(
      'ForecastImage',
      attributes,
      options
    );

    defineForecastImages.prototype.toJSON = function() {
      const attributes = this.get();
      return attributes;
    }

    return defineForecastImages;
  }
}

export default ForecastImage;