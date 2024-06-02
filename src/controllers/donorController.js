const donorService = require('../services/donorService');

const donorController = {

  async getDonors(req, res) {
    try {
      const donors = await donorService.getAllDonors(req.query);
      res.status(200).json({ status: 'success', message: 'Donors fetched successfully', ...donors });
    } catch (error) {
      console.error('Error fetching donors:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error', errors: [error.message] });
    }
  },

  async createDonor(req, res) {
    try {
      const donor = await donorService.createDonor(req.user.id, req.body);
      res.status(201).json({ status: 'success', message: 'Donor created successfully', donor });
    } catch (error) {
      console.error('Error creating donor:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error', errors: [error.message] });
    }
  },

  async getDonorById(req, res) {
    try {
      const donor = await donorService.getDonorById(req.params.donorId);
      if (!donor) {
        return res.status(404).json({ status: 'error', message: 'Donor not found', errors: ['Donor not found'] });
      }
      res.status(200).json({ status: 'success', message: 'Donor fetched successfully', donor });
    } catch (error) {
      console.error('Error fetching donor:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error', errors: [error.message] });
    }
  },

  async getUserDonors(req, res) {
    try {
      const donors = await donorService.getUserDonors(req.user.id);
      res.status(200).json({ status: 'success', message: 'Donors fetched successfully', donors });
    } catch (error) {
      console.error('Error fetching user donors:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error', errors: [error.message] });
    }
  },

  async getUserDonorById(req, res) {
    try {
      const donor = await donorService.getUserDonorById(req.params.donorId);
      res.status(200).json({ status: 'success', message: 'Donor fetched successfully', donor });
    } catch (error) {
      res.status(500).json({ status : 'error', message: 'Internal server error', errors: [error.message] });
    }
  },

  async updateDonor(req, res) {
    try {
      const donor = await donorService.updateDonor(req.params.donorId, req.body);
      res.status(200).json({ status: 'success', message: 'Donor updated successfully', data : { id: donor.id, ...req.body } });
    } catch (error) {
      res.status(500).json({ status : 'error', message: 'Internal server error', errors: [error.message] });
    }
  },

  async deleteDonor(req, res) {
    try {
      await donorService.deleteDonor(req.params.donorId);
      res.status(200).send( { status : 'success', message: 'Donor deleted successfully', data : { id: req.params.donorId } } );
    } catch (error) {
      res.status(500).json({ status : 'error', message: 'Internal server error', errors: [error.message] });
    }
  }
};

module.exports = donorController;
