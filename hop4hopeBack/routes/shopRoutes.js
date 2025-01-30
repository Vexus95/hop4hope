const express = require('express');
const { buyCharacter, buyAnimation } = require('../controllers/shopController');
const authenticateUser = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to buy a character
router.post('/buy-character', authenticateUser, buyCharacter);

// Route to buy an animation
router.post('/buy-animation', authenticateUser, buyAnimation);

module.exports = router;
