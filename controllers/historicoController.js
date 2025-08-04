const Historico = require('../models/historico');

exports.listar = async (req, res) => {
    try {
        const historico = await Historico.findAll();
        res.json(historico);                
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

exports.criar = async(req, res) => {
    try {
        const novoHistorico = await Historico.create(req.body);
        res.status(201).json(novoHistorico);        
    } catch (error) {
        res.status(404).json({ erro: error.message });
    }
};
