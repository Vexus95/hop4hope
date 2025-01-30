const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Utilisateur = require('./Utilisateur');
const Personnage = require('./Personnage');

const Possede = sequelize.define('Possede', {
    Id_utilisateur: {
        type: DataTypes.INTEGER,
        references: { model: Utilisateur, key: 'Id_utilisateur' },
        primaryKey: true,
    },
    Id_personnage: {
        type: DataTypes.INTEGER,
        references: { model: Personnage, key: 'Id_personnage' },
        primaryKey: true,
    },
}, { timestamps: false });

module.exports = Possede;
