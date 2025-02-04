const express = require('express');
const { registerUser, loginUser, logoutUser, getUserCharacters, getUserQuests, getUserInfo } = require('../controllers/utilisateurController');
const authenticateUser = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', authenticateUser, logoutUser);

// Protected routes (require authentication)
router.get('/characters', authenticateUser, getUserCharacters);
router.get('/quests', authenticateUser, getUserQuests);
router.get('/info',authenticateUser,getUserInfo);

module.exports = router;
