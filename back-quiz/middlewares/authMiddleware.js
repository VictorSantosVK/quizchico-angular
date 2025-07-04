require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log('[AUTH] Iniciando verificação do token...');
  
  // 1. Extrair o token
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
  console.log('[AUTH] Token recebido:', token ? `${token.substring(0, 10)}...` : 'Nenhum token');

  if (!token) {
    console.log('[AUTH] Erro: Token não fornecido');
    return res.status(401).json({ error: 'Token de acesso não fornecido' });
  }

  // 2. Verificar a chave secreta
  if (!process.env.JWT_SECRET) {
    console.error('[AUTH] Erro crítico: JWT_SECRET não definido');
    return res.status(500).json({ error: 'Erro de configuração do servidor' });
  }

  // 3. Verificar o token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('[AUTH] Erro na verificação:', err.name);
      
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Token expirado',
          solution: 'Faça login novamente'
        });
      }
      
      return res.status(401).json({ 
        error: 'Token inválido',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }

    console.log('[AUTH] Token válido. Payload:', decoded);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || 'user'
    };
    next();
  });
};