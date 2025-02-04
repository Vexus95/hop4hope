const express = require('express');
const { getAllPersonnages, createPersonnage, getPersonnageById, setActivePersonnage, getUserActivePersonnage } = require('../controllers/personnageController');

const router = express.Router();

router.get('/getAll', getAllPersonnages);
router.post('/', createPersonnage);
router.get('/:id', getPersonnageById);
router.post('/set-active', authenticateUser, setActivePersonnage);
router.get('/active', authenticateUser, getUserActivePersonnage);

module.exports = router;
