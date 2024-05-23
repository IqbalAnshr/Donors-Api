'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Request extends Model {
    static associate(models) {
      Request.belongsTo(models.User, { foreignKey: 'userId' }, { onDelete: 'cascade' });
    }
  }
  Request.init({
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hospital: {
      type: DataTypes.STRING,
      allowNull: false
    },
    organType: {
      type: DataTypes.ENUM('Heart', 'Liver', 'Kidney', 'Lung', 'Pancreas', 'Intestine'),
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Request',
  });
  return Request;
};
