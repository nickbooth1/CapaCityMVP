const express = require('express');
const userController = require('../controllers/userController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// POST /api/users/profile - Create or update user profile
// This doesn't require authentication as it's used during signup
router.post('/profile', userController.createOrUpdateProfile);

// GET /api/users/profile - Get current user profile
router.get('/profile', authenticateUser, userController.getProfile);

// GET /api/users/:id - Get user by ID (requires authentication)
router.get('/:id', authenticateUser, userController.getProfile);

module.exports = router; 