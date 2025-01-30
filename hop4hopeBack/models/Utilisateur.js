const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Utilisateur = sequelize.define('Utilisateur', {
    Id_utilisateur: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Nom: { type: DataTypes.STRING(200), allowNull: false },
    Prénom: { type: DataTypes.STRING(200), allowNull: false },
    Email: { type: DataTypes.STRING(200), allowNull: false, unique: true },
    motdepasse: { type: DataTypes.STRING(200), allowNull: false },
    points: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 } // New field for quest points
}, { timestamps: false });

module.exports = Utilisateur;
