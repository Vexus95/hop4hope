const express = require('express');
const { getAllPersonnages, createPersonnage, getPersonnageById, setActivePersonnage, getUserActivePersonnage } = require('../controllers/personnageController');
const authenticateUser = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/getAll', getAllPersonnages);
router.post('/', createPersonnage);
router.post('/set-active', authenticateUser, setActivePersonnage);
router.get('/active', authenticateUser, getUserActivePersonnage); 
router.get('/:id', getPersonnageById);
module.exports = router;
