const express = require('express');
const maintenanceController = require('../controllers/maintenanceController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// All maintenance endpoints require authentication
router.use(authenticateUser);

// GET /api/maintenance - Get all maintenance requests (can filter by query params)
router.get('/', maintenanceController.getAll);

// GET /api/maintenance/:id - Get maintenance request by ID
router.get('/:id', maintenanceController.getById);

// POST /api/maintenance - Create new maintenance request
router.post('/', maintenanceController.create);

// PUT /api/maintenance/:id - Update maintenance request
router.put('/:id', maintenanceController.update);

// PATCH /api/maintenance/:id/status - Change maintenance request status
router.patch('/:id/status', maintenanceController.changeStatus);

// DELETE /api/maintenance/:id - Delete maintenance request
router.delete('/:id', maintenanceController.delete);

module.exports = router; 