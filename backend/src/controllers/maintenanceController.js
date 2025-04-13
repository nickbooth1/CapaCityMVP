const MaintenanceRequest = require('../models/maintenance');

/**
 * Maintenance Request controller
 */
const maintenanceController = {
  /**
   * Get all maintenance requests with optional filtering
   */
  getAll: async (req, res, next) => {
    try {
      const filters = {
        status: req.query.status,
        standId: req.query.standId,
        airportId: req.query.airportId
      };
      
      const requests = await MaintenanceRequest.getAll(filters);
      res.json(requests);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get maintenance request by ID
   */
  getById: async (req, res, next) => {
    try {
      const request = await MaintenanceRequest.getById(req.params.id);
      
      if (!request) {
        return res.status(404).json({ error: 'Maintenance request not found' });
      }
      
      res.json(request);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create new maintenance request
   */
  create: async (req, res, next) => {
    try {
      // Add user ID from authenticated user
      const requestData = {
        ...req.body,
        user_id: req.user.id
      };
      
      const request = await MaintenanceRequest.create(requestData);
      res.status(201).json(request);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update maintenance request
   */
  update: async (req, res, next) => {
    try {
      const request = await MaintenanceRequest.update(req.params.id, req.body);
      
      if (!request) {
        return res.status(404).json({ error: 'Maintenance request not found' });
      }
      
      res.json(request);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Change maintenance request status
   */
  changeStatus: async (req, res, next) => {
    try {
      const { status } = req.body;
      
      if (!['pending', 'in_progress', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      
      const request = await MaintenanceRequest.update(req.params.id, { 
        status,
        updated_by: req.user.id
      });
      
      if (!request) {
        return res.status(404).json({ error: 'Maintenance request not found' });
      }
      
      res.json(request);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete maintenance request
   */
  delete: async (req, res, next) => {
    try {
      await MaintenanceRequest.delete(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = maintenanceController; 