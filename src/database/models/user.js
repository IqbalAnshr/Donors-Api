'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phoneNumber: {
      type: DataTypes.STRING
    },
    addressId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Addresses',
        key: 'id'
      }
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Roles',
        key: 'id'
      }
    },
    profilePicturePath: {
      type: DataTypes.STRING
    }
  }, {});

  User.associate = function(models) {
    User.belongsTo(models.Role, { foreignKey: 'RoleId' });
    User.belongsTo(models.Address, { foreignKey: 'addressId' });

    User.hasMany(models.Request, { foreignKey: 'userId' });
    User.hasMany(models.Donor, { foreignKey: 'userId' });
    User.hasMany(models.RefreshToken, { foreignKey: 'userId', onDelete: 'CASCADE' });
  };


  return User;
};
