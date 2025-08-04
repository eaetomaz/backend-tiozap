const Config = require('../models/config');

exports.listar = async (req, res) => {
    try {
        const config = await Config.findAll();
        res.json(config);
    } catch (error) {
        res.status(500).json({ erro: error.message});
    }
};

exports.atualizar = async(req, res) => {
    try {
        const { id } = req.params;
        const [ atualizado ] = await Config.update(req.body, { where: { id } });
        if(atualizado) {
            const configAtualizada = await Config.findByPk(id);
            res.json(configAtualizada);
        } else {
            res.status(404).json({ erro: 'Configuração não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};
