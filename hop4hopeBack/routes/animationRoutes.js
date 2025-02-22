const express = require('express');
const { getAnimationsByPersonnage, setActiveAnimation } = require('../controllers/animationController');
const authenticateUser = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:id_personnage', getAnimationsByPersonnage);
router.post('/set-active', authenticateUser, setActiveAnimation);

module.exports = router;
