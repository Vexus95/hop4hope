const express = require('express');
const { connectDB } = require('./config/database');
const personnageRoutes = require('./routes/personnageRoutes');
const animationRoutes = require('./routes/animationRoutes');

const app = express();
app.use(express.json());

// Routes
app.use('/personnages', personnageRoutes);
app.use('/animations', animationRoutes);

// Lancer le serveur
const PORT = 3000;
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
