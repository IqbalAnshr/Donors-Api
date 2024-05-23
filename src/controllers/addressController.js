const addressService = require('../services/addressService');

const AddressController = {
  async createAddress(req, res) {
    const user = req.user;
    const addressData = req.body; 

    try {
      const address = await addressService.createAddress(user, addressData);
      res.status(201).json({ message: 'Address created successfully', address });
    } catch (error) {
      console.error('Error creating address:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  },

  async getAddress(req, res) {
    const user = req.user; 
    try {
      const address = await addressService.getAddressById(user);
      if (!address) {
        return res.status(404).json({ message: 'Address not found' });
      }
      res.json( address );
    } catch (error) {
      console.error('Error getting address:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async updateAddress(req, res) {
    const user = req.user; 
    const updatedData = req.body;

    try {
      const address = await addressService.updateAddress(user, updatedData);
      res.json({ message: 'Address updated successfully', address });
    } catch (error) {
      console.error('Error updating address:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async deleteAddress(req, res) {
    const user = req.user; 
    try {
      await addressService.deleteAddress(user);
      res.json({ message: 'Address deleted successfully' });
    } catch (error) {
      console.error('Error deleting address:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = AddressController;
