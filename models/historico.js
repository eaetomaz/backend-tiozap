const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Historico = sequelize.define('historico', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    datahoraenvio: { type: DataTypes.DATE },
    mensagemenviada: { type: DataTypes.TEXT },
    destinatario: { type: DataTypes.STRING(20) }
}, {
  tableName: 'thistorico',
  timestamps: false,
});

module.exports = Historico;  