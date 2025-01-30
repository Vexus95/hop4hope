const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const personnageRoutes = require('./routes/personnageRoutes');
const animationRoutes = require('./routes/animationRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/users', userRoutes);
app.use('/personnages', personnageRoutes);
app.use('/animations', animationRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Backend running at http://localhost:${PORT}`);
});
