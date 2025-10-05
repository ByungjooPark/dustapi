import { DataTypes } from "sequelize";

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
  tableName: 'ForecastImages',
  timestamps: true,
  paranoid: true,
}

const ForecastImages = {
  init: sequelize => {
    const defineForecastImages = sequelize.define(
      'ForecastImages',
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

export default ForecastImages;