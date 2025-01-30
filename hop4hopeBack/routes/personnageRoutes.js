const express = require('express');
const { getAllPersonnages, createPersonnage } = require('../controllers/personnageController');

const router = express.Router();

router.get('/', getAllPersonnages);
router.post('/', createPersonnage);

module.exports = router;
