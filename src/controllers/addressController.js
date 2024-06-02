const addressService = require('../services/addressService');

const AddressController = {
  async createAddress(req, res) {
    const user = req.user;
    const addressData = req.body; 

    try {
      const address = await addressService.createAddress(user, addressData);
      return res.status(201).json({ status: 'success', message: 'Address created successfully', address });
    } catch (error) {
      console.error('Error creating address:', error);
      return res.status(500).json({ status: 'error', message: 'Internal server error', errors: [error.message] });
    }
  },

  async getAddress(req, res) {
    const user = req.user; 
    try {
      const address = await addressService.getAddressById(user);
      if (!address) {
        return res.status(404).json({ status: 'error', message: 'Address not found', errors: [] });
      }
      return res.json({status : 'success', message: 'Address fetched successfully', address});
    } catch (error) {
      console.error('Error getting address:', error);
      return res.status(500).json({ status : 'error', message: 'Internal server error', errors: [error.message] });
    }
  },

  async updateAddress(req, res) {
    const user = req.user; 
    const updatedData = req.body;

    try {
      const address = await addressService.updateAddress(user, updatedData);
      return res.json({ status: 'success', message: 'Address updated successfully', data : { id: user.id, ...updatedData} });
    } catch (error) {
      console.error('Error updating address:', error);
      return res.status(500).json({ status: 'error', message: 'Internal server error', errors: [error.message] });
    }
  },

  async deleteAddress(req, res) {
    const user = req.user; 
    try {
      if (!user.addressId) {
        return res.status(404).json({ status : 'error', message: 'Address not found', errors: [] });
      }
      await addressService.deleteAddress(user);
      return res.json({ status : 'success', message: 'Address deleted successfully' , data : {id : user.id} });
    } catch (error) {
      console.error('Error deleting address:', error);
      return res.status(500).json({ status : 'error', message: 'Internal server error' , errors: [error.message] });
    }
  }
};

module.exports = AddressController;
