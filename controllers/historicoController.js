const Historico = require('../models/historico');

exports.listar = async (req, res) => {
    try {
        const historico = await Historico.findAll();
        res.json(historico);                
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

const { validationResult} = require('express-validator');

exports.criar = async(req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
        return res.status(400).json({ erros: erros.array() });
    }

    try {

        const novoHistorico = await Historico.create(req.body);
        res.status(201).json(novoHistorico);        
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};
