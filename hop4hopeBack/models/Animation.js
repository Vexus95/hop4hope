const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Personnage = require('./Personnage');

const Animation = sequelize.define('Animation', {
    Id_animation: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(200), allowNull: false },
    matrice: { type: DataTypes.JSON, allowNull: false },
    Id_personnage: {
        type: DataTypes.INTEGER,
        references: { model: Personnage, key: 'Id_personnage' },
    },
}, { timestamps: false });

module.exports = Animation;
