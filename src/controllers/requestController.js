const requestService = require('../services/requestService');

const requestController = {
  async createRequest(req, res) {
    try {
      const request = await requestService.createRequest(req.user.id, req.body);
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getRequests(req, res) {
    try {
      const query = req.query;
      const requests = await requestService.getAllRequest( query );
      res.status(200).json(requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      res.status(500).json({ message: 'Error fetching requests', error });
    }
  },

  async getRequestById(req, res) {
    try {
      const request = await requestService.getRequestById(req.params.requestId);
      res.status(200).json(request);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getUserRequests(req, res) {
    try {
      const requests = await requestService.getUserRequest(req.user.id);
      res.status(200).json(requests);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getUserRequestById(req, res) {
    try {
      const request = await requestService.getUserRequestById(req.params.requestId);
      res.status(200).json(request);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async updateRequest(req, res) {
    try {
      const request = await requestService.updateRequest(req.params.requestId, req.body);
      res.status(200).json(request);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async deleteRequest(req, res) {
    try {
      await requestService.deleteRequest(req.params.requestId);
      res.status(200).send( { message: 'Request deleted successfully' } );
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = requestController;
