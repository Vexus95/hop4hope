const express = require('express');
const { registerUser, loginUser, getUserCharacters, getUserQuests, getUserInfo } = require('../controllers/utilisateurController');
const authenticateUser = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (require authentication)
router.get('/characters', authenticateUser, getUserCharacters);
router.get('/quests', authenticateUser, getUserQuests);
router.get('/info',authenticateUser,getUserInfo);

module.exports = router;
