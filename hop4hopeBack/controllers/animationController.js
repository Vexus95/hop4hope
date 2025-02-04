const { Animation, Personnage } = require('../models');

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

const setActiveAnimation = async (req, res) => {
    try {
        const { personnageId, animationId } = req.body;

        // Check if the animation exists and belongs to the personnage
        const animation = await Animation.findOne({
            where: { Id_animation: animationId, Id_personnage: personnageId }
        });

        if (!animation) {
            return res.status(403).json({ error: "Animation not found or doesn't belong to this character" });
        }

        // Update active animation for the personnage
        await Personnage.update({ activeAnimationId: animationId }, { where: { Id_personnage: personnageId } });

        res.json({ message: "Active animation updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Error updating active animation" });
    }
};

module.exports = { getAnimationsByPersonnage, setActiveAnimation };
