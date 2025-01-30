const { sequelize, connectDB } = require('./config/database');
const { Utilisateur, Personnage, Animation, Quete, Possede, Avoir } = require('./models');

const syncDB = async () => {
    try {
        await connectDB();
        await sequelize.sync({ force: true }); // Utilisez { force: true } uniquement en développement (supprime et recrée les tables)
        console.log('Les tables ont été synchronisées avec succès.');
    } catch (error) {
        console.error('Erreur lors de la synchronisation :', error);
    } finally {
        process.exit();
    }
};

syncDB();
