require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('TioZap API está rodando!');
});

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

    

