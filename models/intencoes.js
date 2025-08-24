const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Intencoes = sequelize.define('Intencoes', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    descricao: { type: DataTypes.TEXT },
    frase_exemplo: { type: DataTypes.TEXT },
    datahoracadastro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    datahoraatualizado: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'tintencoes',
    timestamps: true,
    createdAt: 'datahoracadastro',
    updatedAt: 'datahoraatualizado'
});

module.exports = Intencoes;
