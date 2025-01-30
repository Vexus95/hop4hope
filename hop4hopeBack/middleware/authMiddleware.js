const jwt = require('jsonwebtoken');

const SECRET_KEY = "your_secret_key"; // Replace with an environment variable in production

const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Attach user info to the request
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
};

module.exports = authenticateUser;
