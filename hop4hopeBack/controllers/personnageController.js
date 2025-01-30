const { Personnage } = require('../models');

// Récupérer tous les personnages
const getAllPersonnages = async (req, res) => {
    try {
        const personnages = await Personnage.findAll();
        res.json(personnages);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des personnages.' });
    }
};

// Ajouter un nouveau personnage
const createPersonnage = async (req, res) => {
    try {
        const { Nom, coût, matrice } = req.body;
        const personnage = await Personnage.create({ Nom, coût, matrice });
        res.status(201).json(personnage);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du personnage.' });
    }
};

module.exports = { getAllPersonnages, createPersonnage };
