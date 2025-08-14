const jwt = require('jsonwebtoken');
const JWT_SECRET = '5AJZ76w4KU';

const payload = {
  id: 1,
  nome: 'Guilherme'
};

exports.gerarToken = async(req, res) => {
    // Geração temporária do token para auth da api
    const token = jwt.sign(payload, JWT_SECRET);
    console.log('Token gerado:', token);

    return res.json({ token });
}