const { Utilisateur, Personnage, Animation, Possede, Avoir_animation } = require('../models');

// 🛍️ Buy a Character
const buyCharacter = async (req, res) => {
    try {
        const userId = req.user.id;
        const { characterId } = req.body;

        // Find the character
        const character = await Personnage.findByPk(characterId);
        if (!character) {
            return res.status(404).json({ error: "Character not found." });
        }

        // Check if user already owns this character
        const alreadyOwned = await Possede.findOne({
            where: { Id_utilisateur: userId, Id_personnage: characterId }
        });

        if (alreadyOwned) {
            return res.status(400).json({ error: "You already own this character." });
        }

        // Get user info
        const user = await Utilisateur.findByPk(userId);

        // Check if user has enough points
        if (user.points < character.coût) {
            return res.status(400).json({ error: "Not enough points to buy this character." });
        }

        // Deduct points and save
        user.points -= character.coût;
        await user.save();

        // Add character to user's inventory
        await Possede.create({ Id_utilisateur: userId, Id_personnage: characterId });

        res.json({
            message: "Character purchased successfully!",
            newPoints: user.points,
            characterId
        });
    } catch (error) {
        res.status(500).json({ error: "Error buying character." });
    }
};

// 🛍️ Buy an Animation
const buyAnimation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { animationId, characterId } = req.body; // Character must be specified

        // Find the animation
        const animation = await Animation.findByPk(animationId);
        if (!animation) {
            return res.status(404).json({ error: "Animation not found." });
        }

        // Check if user owns the specified character
        const characterOwned = await Possede.findOne({
            where: { Id_utilisateur: userId, Id_personnage: characterId }
        });

        if (!characterOwned) {
            return res.status(400).json({ error: "You must own the character to buy its animation." });
        }

        // Check if animation is already owned
        const alreadyOwned = await Avoir_animation.findOne({
            where: { Id_personnage: characterId, Id_animation: animationId }
        });

        if (alreadyOwned) {
            return res.status(400).json({ error: "This animation is already unlocked for this character." });
        }

        // Get user info
        const user = await Utilisateur.findByPk(userId);

        // Check if user has enough points
        if (user.points < animation.coût) { // Ensure `coût` exists in the `Animation` model
            return res.status(400).json({ error: "Not enough points to buy this animation." });
        }

        // Deduct points and save
        user.points -= animation.coût;
        await user.save();

        // Add animation to user's inventory
        await Avoir_animation.create({ Id_personnage: characterId, Id_animation: animationId });

        res.json({
            message: "Animation purchased successfully!",
            newPoints: user.points,
            animationId,
            characterId
        });
    } catch (error) {
        res.status(500).json({ error: "Error buying animation." });
    }
};

module.exports = { buyCharacter, buyAnimation };
