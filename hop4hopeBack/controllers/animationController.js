const { Animation } = require('../models');

// Récupérer les animations d'un personnage
const getAnimationsByPersonnage = async (req, res) => {
    try {
        const { id_personnage } = req.params;
        const animations = await Animation.findAll({ where: { Id_personnage: id_personnage } });
        res.json(animations);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des animations.' });
    }
};

module.exports = { getAnimationsByPersonnage };
