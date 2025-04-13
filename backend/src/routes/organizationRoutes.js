const express = require('express');
const organizationController = require('../controllers/organizationController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// All organization endpoints require authentication
router.use(authenticateUser);

// GET /api/organizations - Get all organizations (admin only)
router.get('/', organizationController.getAll);

// GET /api/organizations/current - Get current user's organization
router.get('/current', organizationController.getCurrentOrganization);

// GET /api/organizations/:id - Get organization by ID
router.get('/:id', organizationController.getById);

// POST /api/organizations - Create new organization (admin only)
router.post('/', organizationController.create);

// PUT /api/organizations/:id - Update organization (admin only)
router.put('/:id', organizationController.update);

// DELETE /api/organizations/:id - Delete organization (admin only)
router.delete('/:id', organizationController.delete);

// GET /api/organizations/:id/users - Get users belonging to organization
router.get('/:id/users', organizationController.getUsers);

module.exports = router; 