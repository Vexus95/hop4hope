const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Ensure this matches in login & verification

const authenticateUser = (req, res, next) => {
    try {
        const token = req.header("Authorization").split(" ")[1]; // Extract token after "Bearer"

        if (!token) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        // Verify token
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Attach decoded user info to request
        next();
    } catch (error) {
        return res.status(400).json({ error: "Invalid token" });
    }
};

module.exports = authenticateUser;
