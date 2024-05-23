const db = require('../database/models');
const address = require('../database/models/address');

const addressService = {
  async createAddress(user, data) {
    
    try {
        const address = await db.Address.create(data);
        await user.update({ addressId: address.id });
        return address;
    } catch (error) {
      throw error;
    }
  },

  async getAddressById(user) {
    console.log('req.userId', user);
    try {
      return await db.Address.findByPk(user.addressId);
    } catch (error) {
      throw error;
    }
  },

  async updateAddress(user, data) {
    try {
      const address = await db.Address.findByPk(user.addressId);
      if (!address) {
        throw new Error('Address not found');
      }
      return await address.update(data);
    } catch (error) {
      throw error;
    }
  },

  async deleteAddress(user) {
    try {
      const address = await db.Address.findByPk(user.addressId);
      if (!address) {
        throw new Error('Address not found');
      }
      await address.destroy();
    } catch (error) {
      throw error;
    }
  }
};

module.exports = addressService;
