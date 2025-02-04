const { Utilisateur, Personnage, Possede } = require('../models');

const getAllPersonnages = async (req, res) => {
    try {
        const personnages = await Personnage.findAll();

        // ✅ Convert Hex String to Hex Array for all characters
        const formattedPersonnages = personnages.map(p => ({
            Id_personnage: p.Id_personnage,
            Nom: p.Nom,
            coût: p.coût,
            matrice: p.matrice 
                ? p.matrice.match(/.{1,2}/g).map(byte => "0x" + byte.toUpperCase()) 
                : []
        }));

        res.json(formattedPersonnages);
    } catch (error) {
        console.error("Error fetching personnages:", error);
        res.status(500).json({ error: 'Erreur lors de la récupération des personnages.', details: error.message });
    }
};


// Ajouter un nouveau personnage
const createPersonnage = async (req, res) => {
    try {
        const { Nom, coût, matrice } = req.body;

        // ✅ Convert incoming array to hex string
        const hexString = matrice.map(byte => byte.toString(16).padStart(2, "0")).join("");

        const personnage = await Personnage.create({ Nom, coût, matrice: hexString });

        res.status(201).json(personnage);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du personnage.' });
    }
};

// Récupérer un personnage par son ID
const getPersonnageById = async (req, res) => {
    try {
        const { id } = req.params;
        const personnage = await Personnage.findByPk(id);

        if (!personnage) {
            return res.status(404).json({ error: "Character not found" });
        }

        // ✅ Convert Hex String (Stored in DB) back to Hex Array
        const hexArray = personnage.matrice 
            ? personnage.matrice.match(/.{1,2}/g).map(byte => "0x" + byte.toUpperCase()) 
            : [];

        res.json({
            Id_personnage: personnage.Id_personnage,
            Nom: personnage.Nom,
            coût: personnage.coût,
            matrice: hexArray // ✅ Now returned in hex format
        });
    } catch (error) {
        res.status(500).json({ error: "Error retrieving character" });
    }
};

const setActivePersonnage = async (req, res) => {
    try {
        const userId = req.user.id; // Extract from token
        const { personnageId } = req.body;

        // Verify the character exists and is owned by the user
        const ownedCharacter = await Possede.findOne({
            where: { Id_utilisateur: userId, Id_personnage: personnageId }
        });

        if (!ownedCharacter) {
            return res.status(403).json({ error: "Character not owned by user" });
        }

        // Update active character for the user
        await Utilisateur.update({ activePersonnageId: personnageId }, { where: { Id_utilisateur: userId } });

        res.json({ message: "Active character updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Error updating active character" });
    }
};

const getUserActivePersonnage = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await Utilisateur.findByPk(userId, {
            include: [{ model: Personnage, as: "activePersonnage" }]
        });

        if (!user.activePersonnageId) {
            return res.status(404).json({ error: "No active character set for user" });
        }

        res.json({
            activePersonnage: {
                Id_personnage: user.activePersonnage.Id_personnage,
                Nom: user.activePersonnage.Nom,
                coût: user.activePersonnage.coût,
                matrice: user.activePersonnage.matrice,
                activeAnimationId: user.activePersonnage.activeAnimationId
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Error retrieving active character" });
    }
};


// ✅ Corrected module.exports (Include all functions)
module.exports = { getAllPersonnages, createPersonnage, getPersonnageById, setActivePersonnage, getUserActivePersonnage };
