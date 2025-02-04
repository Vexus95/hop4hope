const { Animation, Personnage } = require('../models');

// Convert hex string to hex array format ("0xXX")
const formatHexMatrice = (hexString) => {
    return hexString ? hexString.match(/.{1,2}/g).map(byte => "0x" + byte.toUpperCase()) : [];
};

// ✅ Retrieve all animations for a specific character (Formatted)
const getAnimationsByPersonnage = async (req, res) => {
    try {
        const { id_personnage } = req.params;
        const animations = await Animation.findAll({ where: { Id_personnage: id_personnage } });

        // Convert `matrice` field to hex array format
        const formattedAnimations = animations.map(anim => ({
            Id_animation: anim.Id_animation,
            name: anim.name,
            matrice: formatHexMatrice(anim.matrice), // ✅ Convert to hex array
            Id_personnage: anim.Id_personnage
        }));

        res.json(formattedAnimations);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des animations.' });
    }
};

// ✅ Set an active animation for a character
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
