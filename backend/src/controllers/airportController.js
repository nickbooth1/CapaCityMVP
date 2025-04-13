const Airport = require('../models/airport');

/**
 * Airport controller
 */
const airportController = {
  /**
   * Get all airports
   */
  getAll: async (req, res, next) => {
    try {
      const airports = await Airport.getAll();
      res.json(airports);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get airport by ID
   */
  getById: async (req, res, next) => {
    try {
      const airport = await Airport.getById(req.params.id);
      
      if (!airport) {
        return res.status(404).json({ error: 'Airport not found' });
      }
      
      res.json(airport);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create new airport
   */
  create: async (req, res, next) => {
    try {
      const airport = await Airport.create(req.body);
      res.status(201).json(airport);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update airport
   */
  update: async (req, res, next) => {
    try {
      const airport = await Airport.update(req.params.id, req.body);
      
      if (!airport) {
        return res.status(404).json({ error: 'Airport not found' });
      }
      
      res.json(airport);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete airport
   */
  delete: async (req, res, next) => {
    try {
      await Airport.delete(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = airportController; 