const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Personnage = sequelize.define('Personnage', {
    Id_personnage: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Nom: { type: DataTypes.STRING(200), allowNull: false },
    coût: { type: DataTypes.INTEGER, allowNull: false },
    matrice: { type: DataTypes.TEXT, allowNull: false },
    image: { type: DataTypes.STRING(500), allowNull: true },
    activeAnimationId: { type: DataTypes.INTEGER, allowNull: true }
}, { timestamps: false });

module.exports = Personnage;
