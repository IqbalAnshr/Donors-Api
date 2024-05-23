'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Donor extends Model {
    static associate(models) {
      // Donor belongs to User
      Donor.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Donor.init({
    organType: {
      type: DataTypes.ENUM('Heart', 'Liver', 'Kidney', 'Lung', 'Pancreas', 'Intestine'),
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
      },
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Donor',
  });
  return Donor;
};
