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

const getPersonnageById = async (req, res) => {
    try {
        const { id } = req.params;
        const personnage = await Personnage.findByPk(id);

        if (!personnage) {
            return res.status(404).json({ error: "Character not found" });
        }

        // ✅ Convert Hex String (Stored in DB) back to Hex Array
        const hexArray = personnage.matrice.match(/.{1,2}/g).map(byte => parseInt(byte, 16));

        res.json({
            Id_personnage: personnage.Id_personnage,
            Nom: personnage.Nom,
            coût: personnage.coût,
            matrice: hexArray // ✅ Return as an array instead of a string
        });
    } catch (error) {
        res.status(500).json({ error: "Error retrieving character" });
    }
};

module.exports = { getPersonnageById };


module.exports = { getAllPersonnages, createPersonnage };
