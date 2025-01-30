const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Utilisateur = require('./Utilisateur');
const Quete = require('./Quete');

const Avoir = sequelize.define('Avoir', {
    Id_utilisateur: {
        type: DataTypes.INTEGER,
        references: { model: Utilisateur, key: 'Id_utilisateur' },
        primaryKey: true,
    },
    Id_quete: {
        type: DataTypes.INTEGER,
        references: { model: Quete, key: 'Id_quete' },
        primaryKey: true,
    },
}, { timestamps: false });

module.exports = Avoir;
