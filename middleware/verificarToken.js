function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'acesso negado' });
  }

  try {
    if(token === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibm9tZSI6Ikd1aWxoZXJtZSIsImlhdCI6MTc1NTIxMDUzMX0.QtJ9OVPN_Af6GNnOgwamxI4NQ5TAVk8Mpyrq1MpiCIg')
      next();
    else
      return res.status(403).json({ erro: 'Token inválido ou expirado' });  
  } catch (err) {
    return res.status(403).json({ erro: 'Token inválido ou expirado' });
  }
}

module.exports = verificarToken;
