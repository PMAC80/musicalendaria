// backend/middleware/authMiddleware.js

// Middleware para verificar autenticación y rol
function authMiddleware(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).send('No autenticado');
  }
  next();
}

function adminMiddleware(req, res, next) {
  if (!req.session || req.session.rol !== 'admin') {
    return res.status(403).send('Acceso denegado');
  }
  next();
}

function artistaMiddleware(req, res, next) {
  if (!req.session || req.session.rol !== 'artista') {
    return res.status(403).send('Acceso denegado');
  }
  next();
}

module.exports = { authMiddleware, adminMiddleware, artistaMiddleware };
