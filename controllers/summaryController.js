const Recebidos = require('../models/mensagensrecebidas');

exports.summary = async (req, res) => {
    try {

        const recebidos = await Recebidos.findAll();

        const data = {
            respostas: recebidos.filter(c => c.respondida).length,
            recebidos: recebidos.length,
            mediaResposta: recebidos.length > 0 ? (recebidos.filter(c => c.respondida).length / recebidos.length) * 100 : 0
        };
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ erro: error.message});
    }
};