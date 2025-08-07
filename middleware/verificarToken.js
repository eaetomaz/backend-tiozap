const jwt = require('jsonwebtoken');
const JWT_SECRET = 'teste';

const payload = {
  id: 1,
  nome: 'Guilherme'
};


// Geração temporária do token para auth da api
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
console.log('Token gerado:', token);

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ erro: 'acesso negado' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = payload; // opcional: guardar dados do usuário
    next();
  } catch (err) {
    return res.status(403).json({ erro: 'Token inválido ou expirado' });
  }
}

module.exports = verificarToken;
