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
                goal: quest.goal, // Fix: use goal from Avoir instead of defaultGoal
                rewardClaimed: false
            });
        }

        // Update progress
        questProgress.currentProgress += progressAmount;

        // Check if the quest is completed
        if (questProgress.currentProgress >= questProgress.goal) {
            questProgress.currentProgress = questProgress.goal; // Cap progress at goal

            res.json({
                message: "Quest completed!",
                currentProgress: questProgress.currentProgress,
                goal: questProgress.goal,
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

// Claim quest reward
const claimQuestReward = async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from token
        const { questId } = req.body;

        // Find user's quest progress
        const questProgress = await Avoir.findOne({
            where: { Id_utilisateur: userId, Id_quete: questId }
        });

        if (!questProgress) {
            return res.status(404).json({ error: "Quest not found for this user." });
        }

        // Check if quest is completed
        if (questProgress.currentProgress < questProgress.goal) {
            return res.status(400).json({ error: "Quest not completed yet." });
        }

        // Check if reward has already been claimed
        if (questProgress.rewardClaimed) {
            return res.status(400).json({ error: "Reward already claimed." });
        }

        // Get quest details
        const quest = await Quete.findByPk(questId);
        if (!quest) {
            return res.status(404).json({ error: "Quest not found." });
        }

        // Update user points
        const user = await Utilisateur.findByPk(userId);
        user.points += quest.points; // Add quest points to user
        await user.save();

        // Mark quest reward as claimed
        questProgress.rewardClaimed = true;
        await questProgress.save();

        res.json({
            message: "Reward claimed successfully!",
            newPoints: user.points,
            questStatus: "Reward Claimed"
        });
    } catch (error) {
        res.status(500).json({ error: "Error claiming quest reward" });
    }
};

module.exports = { updateQuestProgress, claimQuestReward };
