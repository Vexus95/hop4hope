const express = require('express');
const { getAllPersonnages, createPersonnage, getPersonnageById } = require('../controllers/personnageController');

const router = express.Router();

router.get('/', getAllPersonnages);
router.post('/', createPersonnage);
router.get('/:id', getPersonnageById);

module.exports = router;
