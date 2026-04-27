// Middleware de autenticación (implementación incompleta/vulnerable)

const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Sin token' });
    }

    // Vulnerabilidad: Sin validar expiración del token
    const decoded = jwt.verify(token, global.jwtSecret, { ignoreExpiration: true });
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Middleware sin implementación adecuada
const authorize = (requiredRole) => {
  return (req, res, next) => {
    // Vulnerabilidad: Sin validar userId
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    // Vulnerabilidad: Sin verificar rol
    next();
  };
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  // Vulnerabilidad: Expone detalles de error
  res.status(500).json({ 
    error: err.message,
    stack: err.stack
  });
};

module.exports = {
  authenticate,
  authorize,
  errorHandler
};
