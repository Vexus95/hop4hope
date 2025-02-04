const { sequelize } = require('../config/database');
const Utilisateur = require('./Utilisateur');
const Personnage = require('./Personnage');
const Animation = require('./Animation');
const Quete = require('./Quete');
const Avoir = require('./Avoir');
const Possede = require('./Possede');

// Relations Utilisateur <--> Quête (Many-to-Many)
Utilisateur.belongsToMany(Quete, { through: Avoir, foreignKey: 'Id_utilisateur' });
Quete.belongsToMany(Utilisateur, { through: Avoir, foreignKey: 'Id_quete' });

// Relations Utilisateur <--> Personnage (Many-to-Many)
Utilisateur.belongsToMany(Personnage, { through: Possede, foreignKey: 'Id_utilisateur' });
Personnage.belongsToMany(Utilisateur, { through: Possede, foreignKey: 'Id_personnage' });

// Relation Personnage <--> Animation (One-to-Many)
Personnage.hasMany(Animation, { foreignKey: 'Id_personnage' });
Animation.belongsTo(Personnage, { foreignKey: 'Id_personnage' });
Utilisateur.belongsTo(Personnage, { foreignKey: 'activePersonnageId', as: 'activePersonnage' });

module.exports = {
    sequelize,
    Utilisateur,
    Personnage,
    Animation,
    Quete,
    Avoir,
    Possede,
};


