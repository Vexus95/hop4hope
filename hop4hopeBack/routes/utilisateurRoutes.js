const express = require('express');
const { registerUser, loginUser, getUserCharacters, getUserQuests } = require('../controllers/userController');
const authenticateUser = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (require authentication)
router.get('/characters', authenticateUser, getUserCharacters);
router.get('/quests', authenticateUser, getUserQuests);

module.exports = router;
