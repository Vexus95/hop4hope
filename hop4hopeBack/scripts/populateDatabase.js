const { sequelize } = require('../config/database');
const { Utilisateur, Personnage, Animation, Quete, Avoir, Possede } = require('../models');
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

        // 🔹 Convert Hex Arrays to Hex Strings
        const hexArrayToString = (hexArray) => {
            return hexArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
        };

        // 🔹 Sample Hex Arrays for Personnages and Animations
        const warriorMatrice = hexArrayToString([0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0xab, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xe0, 0xf8, 0xfc, 0x3e, 0x1e, 0x0e, 0x3e, 0xfc, 0xf8, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xaa, 0x00, 0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 0xf0, 0xf0, 0x30, 
            0x30, 0x70, 0xf0, 0xe0, 0xf0, 0x70, 0x30, 0x30, 0x70, 0xff, 0xff, 0x07, 0x00, 0x00, 0x00, 0x00, 
            0xfc, 0xff, 0xff, 0x70, 0xf0, 0xe0, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x6a, 0x00, 0x01, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 
            0xff, 0xff, 0x01, 0x00, 0x00, 0x00, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x0f, 0x3f, 0x3c, 0x1e, 0x0e, 0xfc, 0xf8, 
            0x78, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xab, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x07, 0xff, 0xff, 0xc0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 
            0xf0, 0xfc, 0x3f, 0x0f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0xaa, 0x80, 0x00, 0x80, 0x00, 0x80, 0x00, 0x80, 0x00, 0x80, 0x00, 0x80, 0x00, 
            0x80, 0x00, 0x80, 0x00, 0x80, 0x00, 0x80, 0x00, 0x80, 0x03, 0x87, 0x1f, 0xbe, 0x38, 0xb0, 0x30, 
            0xb0, 0x30, 0xb0, 0x30, 0xb0, 0x30, 0xb0, 0x30, 0xb0, 0x30, 0xb0, 0x30, 0xb0, 0x30, 0xb0, 0xb0, 
            0x38, 0xbe, 0x1f, 0x87, 0x03, 0x80, 0x00, 0x80, 0x00, 0x80, 0x00, 0x80, 0x00, 0x80, 0x00, 0x80, 
            0x00, 0x80, 0x00, 0x80, 0x00, 0x80, 0x00, 0x80, 0x00, 0x80, 0x00, 0x80, 0x00, 0x80, 0x00, 0x80, 
            0x00, 0x80, 0x00, 0x80, 0x00, 0x80, 0x00, 0xaa]);
        const mageMatrice = hexArrayToString([0x01, 0x03, 0x00, 0xac, 0xbb, 0x6b, 0x81, 0x88]);

        // 🔹 Create Sample Characters
        const characters = await Personnage.bulkCreate([
            { Nom: "Warrior", coût: 100, matrice: warriorMatrice },
            { Nom: "Mage", coût: 200, matrice: mageMatrice }
        ]);
        console.log("✅ Characters added.");

        // 🔹 Sample Hex Arrays for Animations
        const attackAnimation = hexArrayToString([0x10, 0x20, 0x30, 0x40, 0x50, 0x60, 0x70, 0x80]);
        const defendAnimation = hexArrayToString([0x90, 0xA0, 0xB0, 0xC0, 0xD0, 0xE0, 0xF0, 0xFF]);

        // 🔹 Create Sample Animations
        const animations = await Animation.bulkCreate([
            { name: "Attack", matrice: attackAnimation, Id_personnage: characters[0].Id_personnage },
            { name: "Defend", matrice: defendAnimation, Id_personnage: characters[1].Id_personnage }
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
