// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { verifyToken, requireRole } = require('../middleware/jwtMiddleware');

// Ruta GET para mostrar el formulario de login (más adelante se usará en frontend)

// router.get('/login', authController.showLoginForm); // opcional si se renderiza desde backend

// Ruta POST para procesar el login del usuario
router.post('/login', authController.login);

// Ruta POST para registrar un nuevo usuario (artista o admin)
router.post('/register', authController.register);

// Logout: con JWT el servidor no mantiene sesión. El frontend debe eliminar el token.
router.post('/logout', (req, res) => {
  // Placeholder:Invalidate token if you keep a token blacklist. For now instruct client to delete token.
  res.json({ message: 'Logout: elimine el token en el cliente' });
});

// Ruta protegida para el panel de administrador
// Nota: las páginas de dashboard están servidas en `server.js` y protegidas por JWT.

// Exporta el router para usarlo en server.js
module.exports = router;
