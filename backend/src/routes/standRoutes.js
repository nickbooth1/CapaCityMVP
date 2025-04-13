const express = require('express');
const standController = require('../controllers/standController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// GET /api/stands - Get all stands (can filter by airportId query param)
router.get('/', standController.getAll);

// GET /api/stands/:id - Get stand by ID
router.get('/:id', standController.getById);

// POST /api/stands - Create new stand (requires authentication)
router.post('/', authenticateUser, standController.create);

// PUT /api/stands/:id - Update stand (requires authentication)
router.put('/:id', authenticateUser, standController.update);

// DELETE /api/stands/:id - Delete stand (requires authentication)
router.delete('/:id', authenticateUser, standController.delete);

module.exports = router; 