require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const Intencoes = require('./models/intencoes');
const Respostas = require('./models/respostas');

Intencoes.hasMany(Respostas, { as: 'respostas', foreignKey: 'id_intencao' });
Respostas.belongsTo(Intencoes, { as: 'intencao', foreignKey: 'id_intencao' });

module.exports = { Intencoes, Respostas, sequelize };

const app = express();
const PORT = process.env.PORT || 3001;

const configRoutes = require('./routes/configRoutes');
const historicoRoutes = require('./routes/historicoRoutes');
const authRoutes = require('./routes/authRouter');
const integrationRoutes = require('./routes/integrationRoutes');
const summaryRoutes = require('./routes/summaryRouter');

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/config', configRoutes);
app.use('/historico', historicoRoutes);
app.use('/auth', authRoutes)
app.use('/api', integrationRoutes);
app.use('/summary', summaryRoutes);

const whatsappService = require('./services/whatsappService');
const { iniciarBot } = require('./services/botService');

(async () => {
  const sendMessage = await whatsappService.init();
  iniciarBot(sendMessage);
})();

sequelize.sync()
    .then(() => {
        console.log('Banco sincronizado com sucesso!');
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);            
        });
    })
    .catch((err) => {
        console.error('Erro ao conectar com o banco: ', err);
    });

    

