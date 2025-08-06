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

    const config = await Config.findByPk(id);

    if (!config) {
        return res.status(404).json({ erro: 'Configuração não encontrada' });
    }

    await config.update(req.body);
    res.json(config);

} catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
}
};
