require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

const configRoutes = require('./routes/configRoutes');
const historicoRoutes = require('./routes/historicoRoutes');
const authRoutes = require('./routes/authRouter');

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/config', configRoutes);
app.use('/historico', historicoRoutes);
app.use('/auth', authRoutes)

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

    

