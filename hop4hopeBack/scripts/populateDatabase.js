const { sequelize } = require('../config/database');
const { Utilisateur, Personnage, Animation, Quete, Avoir, Possede, Avoir_animation } = require('../models');
const bcrypt = require('bcryptjs');

const populateDatabase = async () => {
    try {
        console.log("🔄 Populating database with initial data...");

        // 🌟 Reset all tables (Optional: Use { force: true } to drop & recreate)
        await sequelize.sync({ alter: true });

        // 🔹 Create Sample Users
        const hashedPassword = await bcrypt.hash("password123", 10);
        const users = await Utilisateur.bulkCreate([
            { Nom: "John", Prénom: "Doe", Email: "john@example.com", motdepasse: hashedPassword, points: 500 },
            { Nom: "Jane", Prénom: "Smith", Email: "jane@example.com", motdepasse: hashedPassword, points: 800 }
        ]);
        console.log("✅ Users added.");

        // 🔹 Create Sample Characters
        const characters = await Personnage.bulkCreate([
            { Nom: "Warrior", coût: 100, matrice: JSON.stringify([[1, 0], [0, 1]]) },
            { Nom: "Mage", coût: 200, matrice: JSON.stringify([[0, 1], [1, 0]]) }
        ]);
        console.log("✅ Characters added.");

        // 🔹 Create Sample Animations
        const animations = await Animation.bulkCreate([
            { name: "Attack", matrice: JSON.stringify([[1, 1], [0, 1]]), Id_personnage: characters[0].Id_personnage },
            { name: "Defend", matrice: JSON.stringify([[0, 1], [1, 1]]), Id_personnage: characters[1].Id_personnage }
        ]);
        console.log("✅ Animations added.");

        // 🔹 Create Sample Quests
        const quests = await Quete.bulkCreate([
            { Nom: "First Steps", description: "Walk 100 steps", points: 50, date_debut: new Date(), date_fin: new Date(), defaultGoal: 100 },
            { Nom: "Hero's Journey", description: "Win 5 battles", points: 150, date_debut: new Date(), date_fin: new Date(), defaultGoal: 5 }
        ]);
        console.log("✅ Quests added.");

        // 🔹 Assign a Quest to a User (Progress Tracking)
        await Avoir.create({
            Id_utilisateur: users[0].Id_utilisateur,
            Id_quete: quests[0].Id_quete,
            currentProgress: 20, // User has completed 20% of the quest
            goal: quests[0].defaultGoal,
            rewardClaimed: false
        });

        console.log("✅ Quest progress assigned.");

        // 🔹 Give User a Character
        await Possede.create({
            Id_utilisateur: users[0].Id_utilisateur,
            Id_personnage: characters[0].Id_personnage
        });

        console.log("✅ Characters assigned to users.");

        console.log("🎉 Database populated successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Error populating database:", error);
        process.exit(1);
    }
};

// Run the script
populateDatabase();
