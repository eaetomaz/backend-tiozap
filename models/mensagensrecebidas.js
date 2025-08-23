const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MensagensRecebidas = sequelize.define('mensagensrecebidas', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    celularremetente: { type: DataTypes.STRING(20) },
    mensagem: { type: DataTypes.TEXT },
    datahorarecebimento: { type: DataTypes.DATE },
    respondida: { type: DataTypes.BOOLEAN }
}, {
  tableName: 'tmensagensrecebidas',
  timestamps: false,
});

module.exports = MensagensRecebidas;  