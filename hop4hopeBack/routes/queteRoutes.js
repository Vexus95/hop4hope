const express = require('express');
const { completeQuest } = require('../controllers/questController');
const authenticateUser = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to complete a quest and add points
router.post('/complete', authenticateUser, completeQuest);

module.exports = router;
