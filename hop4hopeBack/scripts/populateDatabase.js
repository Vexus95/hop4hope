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

        // 🔹 Add Default Character Images
        const warriorImage = "https://example.com/warrior.png"; 
        const mageImage = "https://example.com/mage.png"; 

        // 🔹 Create Sample Characters
        const characters = await Personnage.bulkCreate([
            { Nom: "Warrior", coût: 100, matrice: warriorMatrice, image: warriorImage },
            { Nom: "Mage", coût: 200, matrice: mageMatrice, image: mageImage }
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

        console.log("🎉 Database populated successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Error populating database:", error);
        process.exit(1);
    }
};

// Run the script
populateDatabase();
