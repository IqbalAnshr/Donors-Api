const requestService = require('../services/requestService');

const requestController = {
  async createRequest(req, res) {
    try {
      const request = await requestService.createRequest(req.user.id, req.body);
      res.status(201).json({ status: 'success', message: 'Request created successfully', request });
    } catch (error) {
      console.error('Failed to create request:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error', errors: [error.message] });
    }
  },

  async getRequests(req, res) {
    try {
      const query = req.query;
      const requests = await requestService.getAllRequest(query);
      res.status(200).json({ status: 'success', message: 'Requests fetched successfully', ...requests });
    } catch (error) {
      console.error('Internal server error:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error', errors: [error.message] });
    }
  },

  async getRequestById(req, res) {
    try {
      const request = await requestService.getRequestById(req.params.requestId);
      res.status(200).json({ status: 'success', message: 'Request fetched successfully', request });
    } catch (error) {
      console.error('Error fetching request:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error', errors: [error.message] });
    }
  },

  async getUserRequests(req, res) {
    try {
      const requests = await requestService.getUserRequest(req.user.id);
      res.status(200).json({ status: 'success', message: 'Requests fetched successfully', requests });
    } catch (error) {
      console.error('Error fetching user requests:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error', errors: [error.message] });
    }
  },

  async getUserRequestById(req, res) {
    try {
      const request = await requestService.getUserRequestById(req.params.requestId);
      res.status(200).json({ status: 'success', message: 'Request fetched successfully', request });
    } catch (error) {
      console.error('Error fetching user request by ID:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error', errors: [error.message] });
    }
  },

  async updateRequest(req, res) {
    try {
      const request = await requestService.updateRequest(req.params.requestId, req.body);
      if (!request) {
        return res.status(404).json({ status: 'error', message: 'Request not found', errors: ['Request not found'] });
      }
      res.status(200).json({ status: 'success', message: 'Request updated successfully', data: { id: request.id, ...req.body} });
    } catch (error) {
      console.error('Error updating request:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error', errors: [error.message] });
    }
  },

  async deleteRequest(req, res) {
    try {
      const requestId = req.params.requestId;
      if (!requestId) {
        return res.status(400).json({ status: 'error', message: 'Request ID is required', errors: ['Request ID is required'] });
      }
      await requestService.deleteRequest(requestId);
      res.status(200).json({ status: 'success', message: 'Request deleted successfully' });
    } catch (error) {
      console.error('Error deleting request:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error', errors: [error.message] });
    }
  }
};

module.exports = requestController;
