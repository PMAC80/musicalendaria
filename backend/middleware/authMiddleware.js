// backend/middleware/authMiddleware.js

// Middleware para verificar si el usuario está logueado
module.exports = (req, res, next) => {
  if (req.session && req.session.userId) {
    // Usuario logueado, permitir acceso
    next();
  } else {
    // Usuario no logueado, redirigir al login
    res.redirect('/index.html');
  }
};
