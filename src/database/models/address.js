'use strict';
module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false
    },
    district: { // Kecamatan
      type: DataTypes.STRING,
      allowNull: false
    },
    subdistrict: { // Kelurahan
      type: DataTypes.STRING,
      allowNull: false
    },
    streetName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    houseNumber: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});

  Address.associate = function(models) {
    Address.hasOne(models.User, { foreignKey: 'addressId' });
  };

  return Address;
};
