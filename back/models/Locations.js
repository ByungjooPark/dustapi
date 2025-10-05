import { DataTypes } from "sequelize";

const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: false,
    comment: '권역 고유 ID',
  },
  districtName: {
    field: 'district_name',
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '발령 지역명',
  },
  moveName: {
    field: 'move_name',
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '발령 권역명',
  },
  regionName: {
    field: 'region_name',
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: '행정 구역명',
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
  tableName: 'Locations',
  timestamps: true,
  paranoid: true,
}

const Locations = {
  init: sequelize => {
    const defineLocations = sequelize.define(
      'Locations',
      attributes,
      options
    );

    defineLocations.prototype.toJSON = function() {
      const attributes = this.get();
      return attributes;
    }

    return defineLocations;
  }
}

export default Locations;