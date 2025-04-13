const Organization = require('../models/organization');

/**
 * Organization controller
 */
const organizationController = {
  /**
   * Get all organizations
   * Admin only
   */
  getAll: async (req, res, next) => {
    try {
      // Check if user has admin role
      if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
      
      const organizations = await Organization.getAll();
      res.json(organizations);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get organization by ID
   */
  getById: async (req, res, next) => {
    try {
      const organization = await Organization.getById(req.params.id);
      
      // Check if user belongs to this organization or is admin
      if (req.user.organization_id !== organization.id && 
          req.user.role !== 'admin' && 
          req.user.role !== 'superadmin') {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
      
      if (!organization) {
        return res.status(404).json({ error: 'Organization not found' });
      }
      
      res.json(organization);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create new organization
   * Admin only
   */
  create: async (req, res, next) => {
    try {
      // Only superadmin can create organizations
      if (req.user.role !== 'superadmin') {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
      
      const organization = await Organization.create(req.body);
      res.status(201).json(organization);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update organization
   * Admin roles have different permissions
   */
  update: async (req, res, next) => {
    try {
      // Check if user has admin role
      if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
      
      // For client admins, prevent changing the airport_id
      if (req.user.role === 'admin' && req.body.airport_id) {
        const organization = await Organization.getById(req.params.id);
        
        // Client admin attempting to change airport_id
        if (organization && organization.airport_id !== req.body.airport_id) {
          return res.status(403).json({ 
            error: 'Client administrators cannot change the base airport assignment' 
          });
        }
      }
      
      // Remove airport_id from request if user is client admin
      const updateData = { ...req.body };
      if (req.user.role === 'admin') {
        delete updateData.airport_id;
      }
      
      const organization = await Organization.update(req.params.id, updateData);
      
      if (!organization) {
        return res.status(404).json({ error: 'Organization not found' });
      }
      
      res.json(organization);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete organization
   * Superadmin only
   */
  delete: async (req, res, next) => {
    try {
      // Only superadmin can delete organizations
      if (req.user.role !== 'superadmin') {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
      
      await Organization.delete(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get users belonging to organization
   */
  getUsers: async (req, res, next) => {
    try {
      const organization = await Organization.getById(req.params.id);
      
      // Check if user belongs to this organization or is admin
      if (req.user.organization_id !== organization.id && 
          req.user.role !== 'admin' && 
          req.user.role !== 'superadmin') {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
      
      const users = await Organization.getUsers(req.params.id);
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get current user's organization 
   */
  getCurrentOrganization: async (req, res, next) => {
    try {
      if (!req.user.organization_id) {
        return res.status(404).json({ error: 'User does not belong to any organization' });
      }
      
      const organization = await Organization.getById(req.user.organization_id);
      
      if (!organization) {
        return res.status(404).json({ error: 'Organization not found' });
      }
      
      res.json(organization);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = organizationController; 