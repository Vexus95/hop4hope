const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Personnage = sequelize.define('Personnage', {
    Id_personnage: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Nom: { type: DataTypes.STRING(200), allowNull: false },
    coût: { type: DataTypes.INTEGER, allowNull: false },
    matrice: { type: DataTypes.TEXT, allowNull: false } // ✅ Store as a HEX STRING
}, { timestamps: false });

module.exports = Personnage;
