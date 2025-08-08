const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Config = sequelize.define('tconfig', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    ativar: { type: DataTypes.CHAR(1), allowNull: false },
    diassemana: { type: DataTypes.STRING },
    horarioinicial: { type: DataTypes.TIME },
    horariofinal: { type: DataTypes.TIME }

}, {
    tableName: 'tconfig',
    timestamps: false
});

module.exports = Config;
