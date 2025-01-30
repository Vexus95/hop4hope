const { Utilisateur, Avoir, Quete } = require('../models');

// Mark a quest as completed and add points to the user
const completeQuest = async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from token
        const { questId } = req.body;

        // Check if the quest exists
        const quest = await Quete.findByPk(questId);
        if (!quest) {
            return res.status(404).json({ error: "Quest not found" });
        }

        // Check if the user already completed this quest
        const existingCompletion = await Avoir.findOne({
            where: { Id_utilisateur: userId, Id_quete: questId }
        });

        if (existingCompletion) {
            return res.status(400).json({ error: "Quest already completed" });
        }

        // Add the quest completion record
        await Avoir.create({ Id_utilisateur: userId, Id_quete: questId });

        // Update the user's points
        const user = await Utilisateur.findByPk(userId);
        user.points += quest.points;
        await user.save();

        res.json({ message: "Quest completed!", newPoints: user.points });
    } catch (error) {
        res.status(500).json({ error: "Error completing quest" });
    }
};

module.exports = { completeQuest };
