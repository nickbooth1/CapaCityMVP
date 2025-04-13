const express = require('express');
const airportController = require('../controllers/airportController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// GET /api/airports - Get all airports
router.get('/', airportController.getAll);

// GET /api/airports/:id - Get airport by ID
router.get('/:id', airportController.getById);

// POST /api/airports - Create new airport (requires authentication)
router.post('/', authenticateUser, airportController.create);

// PUT /api/airports/:id - Update airport (requires authentication)
router.put('/:id', authenticateUser, airportController.update);

// DELETE /api/airports/:id - Delete airport (requires authentication)
router.delete('/:id', authenticateUser, airportController.delete);

module.exports = router; 