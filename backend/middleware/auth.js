const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Tomamos el token desde el encabezado Authorization
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.replace('Bearer ', '') 
    : null;

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    // Verificamos el token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_fadehouse');
    req.user = decoded; // Agregamos los datos del usuario decodificados al request
    next();
  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Middleware para verificar el rol del usuario
const requireRole = (roles = []) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No autenticado' });
  }

  if (!roles.includes(req.user.rol)) {
    return res.status(403).json({ message: 'No tienes permisos suficientes' });
  }

  next();
};

module.exports = { authMiddleware, requireRole };
