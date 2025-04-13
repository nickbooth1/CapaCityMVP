const Stand = require('../models/stand');

/**
 * Stand controller
 */
const standController = {
  /**
   * Get all stands, optionally filtered by airport
   */
  getAll: async (req, res, next) => {
    try {
      const { airportId } = req.query;
      const stands = await Stand.getAll(airportId);
      res.json(stands);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get stand by ID
   */
  getById: async (req, res, next) => {
    try {
      const stand = await Stand.getById(req.params.id);
      
      if (!stand) {
        return res.status(404).json({ error: 'Stand not found' });
      }
      
      res.json(stand);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create new stand
   */
  create: async (req, res, next) => {
    try {
      const stand = await Stand.create(req.body);
      res.status(201).json(stand);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update stand
   */
  update: async (req, res, next) => {
    try {
      const stand = await Stand.update(req.params.id, req.body);
      
      if (!stand) {
        return res.status(404).json({ error: 'Stand not found' });
      }
      
      res.json(stand);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete stand
   */
  delete: async (req, res, next) => {
    try {
      await Stand.delete(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = standController; 