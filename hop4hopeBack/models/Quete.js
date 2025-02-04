const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Quete = sequelize.define('Quete', {
    Id_quete: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Nom: { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.STRING(500), allowNull: false },
    points: { type: DataTypes.INTEGER, allowNull: false },
    date_debut: { type: DataTypes.DATE, allowNull: false },
    date_fin: { type: DataTypes.DATE, allowNull: false },
    defaultGoal: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM('daily', 'weekly', 'special'), allowNull: false, defaultValue: 'special' } // ✅ New field
}, { timestamps: false });

module.exports = Quete;
