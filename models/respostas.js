const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Respostas = sequelize.define('Respostas', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    id_intencao: { type: DataTypes.BIGINT, allowNull: false },
    texto: { type: DataTypes.TEXT, allowNull: false },
    datahoracadastro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    datahoraatualizado: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'trespostas',
    timestamps: true,
    createdAt: 'datahoracadastro',
    updatedAt: 'datahoraatualizado'
});

module.exports = Respostas;