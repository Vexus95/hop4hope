const { sequelize } = require('../config/database');
const { Utilisateur, Personnage, Animation, Quete, Avoir, Possede } = require('../models');
const bcrypt = require('bcryptjs');

const populateDatabase = async () => {
    try {
        console.log("🔄 Populating database with initial data...");

        // 🌟 Reset all tables (Optional: Use { force: true } to drop & recreate)
        await sequelize.sync({ alter: true });

        // 🔹 Hash user passwords
        const hashedPassword = await bcrypt.hash("password123", 10);

        // 🔹 Convert Hex Arrays to Hex Strings
        const hexArrayToString = (hexArray) => {
            return hexArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
        };

        // 🔹 Sample Hex Matrices for Personnages
        const cowMatrice = hexArrayToString([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 0xc0, 
            0xe0, 0xe0, 0xe0, 0xe0, 0xf0, 0xf0, 0xf0, 0xf8, 0xf8, 0x78, 0x18, 0x08, 0x18, 0x08, 0x18, 0x18, 
            0x38, 0x10, 0xb0, 0xb0, 0xe0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0xc0, 0xfe, 0x7f, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x20, 0x20, 0x20, 
            0x30, 0x30, 0x18, 0x0c, 0x4e, 0xce, 0x8f, 0x85, 0x86, 0xe2, 0xe6, 0xe6, 0xee, 0xcc, 0xd8, 0x38, 
            0xf0, 0xe0, 0xc0, 0xf0, 0x78, 0x78, 0x38, 0x78, 0x38, 0x38, 0x58, 0xf0, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0xfc, 0x57, 0x03, 0x00, 0x08, 0x08, 0x0c, 0x04, 0x04, 0x04, 0x04, 0x08, 0x08, 
            0x18, 0x30, 0x40, 0x60, 0xc6, 0x00, 0x00, 0x0f, 0x17, 0x13, 0x17, 0x1f, 0x10, 0x50, 0xcf, 0x83, 
            0x03, 0x21, 0xc0, 0x00, 0x01, 0x0f, 0xff, 0xfe, 0x1e, 0x0e, 0x08, 0x00, 0x00, 0x00, 0x29, 0x3f, 
            0x3e, 0x7e, 0x7e, 0x3e, 0x0e, 0x02, 0x82, 0xc2, 0x42, 0x42, 0x42, 0x5a, 0x7e, 0x7e, 0x7c, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1f, 0xfd, 0xfc, 0xf8, 0x58, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x06, 0x00, 0x06, 0x03, 0x01, 0x01, 0x01, 0x19, 0x00, 0x00, 0x78, 0xf4, 0xf4, 0x7c, 0xd4, 
            0x84, 0xd5, 0xf9, 0xe0, 0xe0, 0xc2, 0x81, 0x00, 0xc0, 0xf8, 0xff, 0x83, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0xa0, 0xf0, 0x78, 0x7c, 0x7c, 0x7c, 0x7c, 0x78, 0x61, 0x61, 0x61, 0x63, 0x41, 0x7d, 
            0x7f, 0x7f, 0x3e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x3f, 0x75, 0xd0, 
            0xc0, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x7d, 0x7f, 0xff, 0xfe, 0xfc, 0xfc, 
            0xf8, 0x79, 0xf8, 0xd0, 0xf1, 0x33, 0x33, 0x3b, 0x1b, 0x09, 0x0d, 0x07, 0x07, 0x03, 0x07, 0x0f, 
            0x0f, 0x0c, 0x08, 0x0e, 0x0f, 0x0f, 0x0f, 0x0f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x03, 0x03, 0x07, 0x07, 0x06, 0x06, 0x04, 0x04, 0x04, 0x04, 
            0x04, 0x04, 0x06, 0x06, 0x06, 0x06, 0x06, 0x07, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        const bunnyMatrice = hexArrayToString([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x80, 0xe0, 0xe0, 0xf0, 0xf0, 0xf0, 0xf0, 0xf0, 0xf0, 0xf0, 0xe0, 0xc0, 
            0xc0, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf0, 0x78, 0x0c, 0x0c, 0x07, 
            0x03, 0xc1, 0xc1, 0xc1, 0xc3, 0xc3, 0xc2, 0x86, 0x8e, 0x0c, 0x08, 0x18, 0x38, 0x70, 0xe0, 0x60, 
            0x30, 0x38, 0x0c, 0x04, 0x06, 0x02, 0x03, 0xe9, 0xd1, 0xc0, 0xe0, 0xe3, 0x4f, 0xdf, 0x1f, 0x3f, 
            0x3f, 0x1f, 0x1f, 0x0f, 0x07, 0x07, 0x7f, 0xfc, 0xf0, 0x7c, 0x1f, 0x1f, 0x1f, 0x1f, 0x1f, 0x1f, 
            0xff, 0xfe, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x07, 
            0x1e, 0x3c, 0x70, 0x60, 0x60, 0x60, 0xc1, 0xc1, 0xc1, 0xc3, 0xc3, 0xc7, 0xc7, 0xc7, 0x86, 0x04, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0c, 0x00, 0x00, 0x07, 0x0f, 0x09, 0x09, 0x0f, 
            0x08, 0x8f, 0x00, 0x00, 0x90, 0x60, 0x00, 0x00, 0x00, 0x00, 0x00, 0x07, 0xff, 0x00, 0x00, 0xc0, 
            0xe0, 0xf0, 0xf0, 0xf0, 0xf1, 0xf1, 0xf1, 0xe1, 0xc1, 0x01, 0x01, 0x81, 0xc1, 0xc1, 0xc1, 0xc1, 
            0xff, 0xff, 0xff, 0x7f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0xc0, 0xf0, 0x38, 0x1c, 0x0c, 0x04, 0x04, 0x86, 0x82, 0x82, 0xc2, 0xc2, 0xe2, 
            0xe2, 0xe2, 0x61, 0x61, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x30, 0x00, 0x00, 0xe0, 
            0xf0, 0xd0, 0x90, 0xf0, 0x10, 0xf1, 0x40, 0x00, 0x09, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0xe0, 
            0xff, 0x40, 0x00, 0x03, 0x07, 0x0f, 0x0f, 0x0f, 0x8f, 0x8f, 0x8f, 0x87, 0x83, 0x80, 0x80, 0x81, 
            0x83, 0x83, 0x83, 0x83, 0xff, 0xff, 0xff, 0xfe, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1f, 0x3e, 0x78, 0x60, 0xe0, 0xc0, 0x83, 0x83, 0x83, 
            0xc3, 0xc3, 0xc3, 0xe3, 0xf1, 0x71, 0x30, 0x38, 0x3c, 0x1e, 0x0f, 0x0e, 0x1c, 0x38, 0x78, 0x60, 
            0xe0, 0xc0, 0xc0, 0xd7, 0x8b, 0x03, 0x07, 0xc7, 0xf3, 0xfb, 0xf8, 0xfc, 0xfc, 0xf8, 0xf8, 0xf8, 
            0xe0, 0xe0, 0xfe, 0x3f, 0x0f, 0x3e, 0xfc, 0xf8, 0xf8, 0xf8, 0xf8, 0xf8, 0xff, 0x7f, 0x01, 0x01, 
            0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 
            0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x03, 0x07, 0x07, 0x0f, 0x0f, 0x0f, 0x0f, 0x0f, 
            0x0f, 0x0f, 0x07, 0x03, 0x03, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);

        // 🔹 Add Default Character Images
        const cowImage = "./hop4hope/hop4hopeFront/assets/pixil-layer-2.png"; 
        const bunnyImage = "/hop4hope/hop4hopeFront/assets/pixil-layer-3.png"; 

        // 🔹 Create Sample Characters
        const characters = await Personnage.bulkCreate([
            { Nom: "Cow", coût: 100, matrice: cowMatrice, image: cowImage },
            { Nom: "Bunny", coût: 200, matrice: bunnyMatrice, image: bunnyImage }
        ]);
        console.log("✅ Characters added.");

        // Set default character as the first one (Warrior)
        const defaultPersonnage = characters[0];

        // 🔹 Sample Hex Matrices for Animations
        const attackMatrice = hexArrayToString([0x1F, 0x3A, 0x4B, 0x5C, 0x6D, 0x7E, 0x8F, 0x9A]);
        const defendMatrice = hexArrayToString([0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF, 0x11, 0x22]);

        // 🔹 Create Sample Animations (Linked to Characters)
        const animations = await Animation.bulkCreate([
            { name: "Attack", matrice: attackMatrice, Id_personnage: defaultPersonnage.Id_personnage },
            { name: "Defend", matrice: defendMatrice, Id_personnage: characters[1].Id_personnage }
        ]);
        console.log("✅ Animations added.");

        // Set default animation for the default personnage
        const defaultAnimation = animations[0];

        // Assign default animation to the default personnage
        await Personnage.update(
            { activeAnimationId: defaultAnimation.Id_animation },
            { where: { Id_personnage: defaultPersonnage.Id_personnage } }
        );

        // 🔹 Create Sample Users with Default Active Personnage
        const users = await Utilisateur.bulkCreate([
            { 
                Nom: "John", Prénom: "Doe", Email: "john@example.com",
                motdepasse: hashedPassword, points: 500, activePersonnageId: defaultPersonnage.Id_personnage
            },
            { 
                Nom: "Jane", Prénom: "Smith", Email: "jane@example.com",
                motdepasse: hashedPassword, points: 800, activePersonnageId: defaultPersonnage.Id_personnage
            }
        ]);
        console.log("✅ Users added with default active character.");

        // 🔹 Assign Default Character to Each User
        for (const user of users) {
            await Possede.create({
                Id_utilisateur: user.Id_utilisateur,
                Id_personnage: defaultPersonnage.Id_personnage
            });
        }

        console.log("✅ Default character assigned to users.");

        // 🔹 Define Daily and Weekly Quests
        const quests = await Quete.bulkCreate([
            { 
                Nom: "Walk 500 Steps", 
                description: "Walk 500 steps today", 
                points: 50, 
                date_debut: new Date(), 
                date_fin: new Date(), 
                defaultGoal: 500,
                type: "daily" // ✅ Daily quest
            },
            { 
                Nom: "Win 3 Battles", 
                description: "Win 3 battles in a week", 
                points: 200, 
                date_debut: new Date(), 
                date_fin: new Date(new Date().setDate(new Date().getDate() + 7)), // Ends in 7 days
                defaultGoal: 3,
                type: "weekly" // ✅ Weekly quest
            }
        ]);
        console.log("✅ Daily and Weekly Quests added.");

        // 🔹 Assign Daily and Weekly Quests to John (User 1)
        const john = users[0];

        for (const quest of quests) {
            await Avoir.create({
                Id_utilisateur: john.Id_utilisateur,
                Id_quete: quest.Id_quete,
                currentProgress: 0, 
                goal: quest.defaultGoal,
                rewardClaimed: false
            });
        }

        console.log("✅ Daily and Weekly quests assigned to John.");

        console.log("🎉 Database populated successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Error populating database:", error);
        process.exit(1);
    }
};

// Run the script
populateDatabase();
