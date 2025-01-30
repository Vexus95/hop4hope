const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Utilisateur, Personnage, Quete, Possede, Avoir } = require('../models');

const SECRET_KEY = "your_secret_key"; // Replace with an environment variable in production

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { Nom, Prénom, Email, motdepasse } = req.body;

        // Check if the user already exists
        const existingUser = await Utilisateur.findOne({ where: { Email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(motdepasse, 10);

        // Create the user
        const user = await Utilisateur.create({ Nom, Prénom, Email, motdepasse: hashedPassword });

        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { Email, motdepasse } = req.body;

        // Check if the user exists
        const user = await Utilisateur.findOne({ where: { Email } });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(motdepasse, user.motdepasse);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Generate a token
        const token = jwt.sign({ id: user.Id_utilisateur }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: "Error logging in" });
    }
};

// Get all characters a user owns
const getUserCharacters = async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from token
        const characters = await Personnage.findAll({
            include: {
                model: Utilisateur,
                through: Possede,
                where: { Id_utilisateur: userId }
            }
        });

        res.json(characters);
    } catch (error) {
        res.status(500).json({ error: "Error fetching user's characters" });
    }
};

// Get all quests a user has completed
const getUserQuests = async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from token
        const quests = await Quete.findAll({
            include: {
                model: Utilisateur,
                through: Avoir,
                where: { Id_utilisateur: userId }
            }
        });

        res.json(quests);
    } catch (error) {
        res.status(500).json({ error: "Error fetching user's quests" });
    }
};

module.exports = { registerUser, loginUser, getUserCharacters, getUserQuests };
