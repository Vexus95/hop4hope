const mysql = require('mysql2/promise');
const { sequelize, connectDB } = require('../config/database');
require('dotenv').config();

const setupDatabase = async () => {
    try {
        // Create a connection to MySQL (without specifying a database)
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        });

        console.log("🔍 Checking if the database exists...");

        // Check if the database exists
        const [rows] = await connection.query("SHOW DATABASES LIKE ?", [process.env.DB_NAME]);

        if (rows.length > 0) {
            console.log(`✅ Database "${process.env.DB_NAME}" already exists.`);
        } else {
            console.log(`⚡ Creating database "${process.env.DB_NAME}"...`);
            await connection.query(`CREATE DATABASE \`${process.env.DB_NAME}\`;`);
            console.log(`✅ Database "${process.env.DB_NAME}" has been created.`);
        }

        // Close the connection after database verification
        await connection.end();

        // Connect Sequelize to the newly created database
        await connectDB();
        await sequelize.sync({ alter: true }); // Ensures tables are updated safely
        console.log("✅ Database tables synced successfully!");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error setting up the database:", error);
        process.exit(1);
    }
};

// Run the setup
setupDatabase();
