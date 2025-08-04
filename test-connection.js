const sequelize = require('./config/database');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados foi bem-sucedida!');
  } catch (error) {
    console.error('❌ Erro ao conectar:', error);
  }
})();
