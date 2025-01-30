const mysql = require('mysql2/promise');
const { sequelize, connectDB } = require('../config/database');
require('dotenv').config();

const setupDatabase = async () => {
    try {
        // Create a connection to MySQL (without specifying the database)
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        });

        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        console.log(`✅ Database "${process.env.DB_NAME}" is ready!`);

        // Close connection after database is created
        await connection.end();

        // Connect and sync models
        await connectDB();
        await sequelize.sync({ alter: true }); // Use alter to update tables safely
        console.log("✅ Database tables synced successfully!");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error setting up the database:", error);
        process.exit(1);
    }
};

// Run the setup
setupDatabase();
