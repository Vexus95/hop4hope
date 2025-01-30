const express = require('express');
const { updateQuestProgress } = require('../controllers/questController');
const authenticateUser = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to update quest progress
router.post('/progress', authenticateUser, updateQuestProgress);

module.exports = router;
