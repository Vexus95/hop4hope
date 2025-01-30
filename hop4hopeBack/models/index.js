const { sequelize } = require('../config/database');
const Utilisateur = require('./Utilisateur');
const Personnage = require('./Personnage');
const Animation = require('./Animation');

// Relations entre les modèles
Personnage.hasMany(Animation, { foreignKey: 'Id_personnage' });
Animation.belongsTo(Personnage, { foreignKey: 'Id_personnage' });

module.exports = {
    sequelize,
    Utilisateur,
    Personnage,
    Animation,
};
