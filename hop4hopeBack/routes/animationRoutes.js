const express = require('express');
const { getAnimationsByPersonnage } = require('../controllers/animationController');

const router = express.Router();

router.get('/:id_personnage', getAnimationsByPersonnage);

module.exports = router;
