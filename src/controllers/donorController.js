const donorService = require('../services/donorService');

const donorController = {

  async getDonors(req, res) {
    try {
      const donors = await donorService.getAllDonors( req.query );
      res.status(200).json(donors);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching donors', error: error.message });
    }
  },

  async createDonor(req, res) {
    try {
      const donor = await donorService.createDonor(req.user.id, req.body);
      res.status(201).json(donor);
    } catch (error) {
      res.status(500).json({ message: 'Error creating donor', error: error.message });
    }
  },

  async getDonorById(req, res) {
    try {
      const donor = await donorService.getDonorById(req.params.donorId);
      res.status(200).json(donor);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching donor', error: error.message });
    }
  },

  async getUserDonors(req, res) {
    try {
      const donors = await donorService.getUserDonors(req.user.id);
      res.status(200).json(donors);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching donors', error: error.message });
    }
  },

  async getUserDonorById(req, res) {
    try {
      const donor = await donorService.getUserDonorById(req.params.donorId);
      res.status(200).json(donor);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching donor', error: error.message });
    }
  },

  async updateDonor(req, res) {
    try {
      const donor = await donorService.updateDonor(req.params.donorId, req.body);
      res.status(200).json(donor);
    } catch (error) {
      res.status(500).json({ message: 'Error updating donor', error: error.message });
    }
  },

  async deleteDonor(req, res) {
    try {
      await donorService.deleteDonor(req.params.donorId);
      res.status(200).send( { message: 'Donor deleted successfully' } );
    } catch (error) {
      res.status(500).json({ message: 'Error deleting donor', error: error.message });
    }
  }
};

module.exports = donorController;
