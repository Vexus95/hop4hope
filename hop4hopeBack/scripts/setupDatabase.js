const mysql = require('mysql2/promise');
const { sequelize, connectDB } = require('../config/database');
require('dotenv').config();

// Import models AFTER connecting to Sequelize
const Utilisateur = require('../models/Utilisateur');
const Personnage = require('../models/Personnage');
const Animation = require('../models/Animation');
const Quete = require('../models/Quete');
const Avoir = require('../models/Avoir');
const Possede = require('../models/Possede');

const setupDatabase = async () => {
    try {
        console.log("🔍 Checking MySQL connection...");

        // Connect to MySQL server without selecting a database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        });

        console.log("✅ Connected to MySQL server.");

        // Check if the database exists
        const [rows] = await connection.query("SHOW DATABASES LIKE ?", [process.env.DB_NAME]);

        if (rows.length > 0) {
            console.log(`✅ Database "${process.env.DB_NAME}" already exists.`);
        } else {
            console.log(`⚡ Creating database "${process.env.DB_NAME}"...`);
            await connection.query(`CREATE DATABASE \`${process.env.DB_NAME}\`;`);
            console.log(`✅ Database "${process.env.DB_NAME}" has been created.`);
        }

        // Close MySQL connection
        await connection.end();

        console.log("🔄 Connecting Sequelize to the newly created database...");
        await connectDB();

        console.log("📌 Syncing database tables...");
        await sequelize.sync({ alter: true }); // Ensures tables are updated safely

        console.log("✅ All tables have been successfully created or updated!");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error setting up the database:", error);
        process.exit(1);
    }
};

// Run the setup
setupDatabase();
