const { Utilisateur, Avoir, Quete } = require('../models');

// Update quest progress and complete if goal is reached
const updateQuestProgress = async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from token
        const { questId, progressAmount } = req.body; // progressAmount = how much progress to add

        // Find the quest
        const quest = await Quete.findByPk(questId);
        if (!quest) {
            return res.status(404).json({ error: "Quest not found" });
        }

        // Find user's quest progress
        let questProgress = await Avoir.findOne({
            where: { Id_utilisateur: userId, Id_quete: questId }
        });

        // If the quest isn't started yet, create a new entry
        if (!questProgress) {
            questProgress = await Avoir.create({
                Id_utilisateur: userId,
                Id_quete: questId,
                currentProgress: 0,
                goal: quest.defaultGoal // Use default goal from Quete table
            });
        }

        // Update progress
        questProgress.currentProgress += progressAmount;

        // Check if the quest is completed
        if (questProgress.currentProgress >= questProgress.goal) {
            questProgress.currentProgress = questProgress.goal; // Cap progress at goal

            // Update user points
            const user = await Utilisateur.findByPk(userId);
            user.points += quest.points;
            await user.save();

            res.json({
                message: "Quest completed!",
                newPoints: user.points,
                questStatus: "Completed"
            });
        } else {
            res.json({
                message: "Quest progress updated!",
                currentProgress: questProgress.currentProgress,
                goal: questProgress.goal,
                questStatus: "In Progress"
            });
        }

        // Save quest progress
        await questProgress.save();
    } catch (error) {
        res.status(500).json({ error: "Error updating quest progress" });
    }
};

module.exports = { updateQuestProgress };
