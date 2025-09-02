// backend/routes/authRoutes.js

// Importa Express para crear el router de rutas
const express = require('express');
//Cada archivo de rutas suele crear su propio router con express.Router()
const router = express.Router();

// Importa el controlador de autenticación
const authController = require('../controllers/authController');

// Ruta GET para mostrar el formulario de login (más adelante se usará en frontend)

// router.get('/login', authController.showLoginForm); // opcional si se renderiza desde backend

// Ruta POST para procesar el login del usuario
router.post('/login', authController.login);

// Ruta POST para registrar un nuevo usuario (artista o admin)
router.post('/register', authController.register);

// Ruta GET para cerrar sesión (se podria haber usado una ruta POST)
router.get('/logout', authController.logout);

// Exporta el router para usarlo en server.js
module.exports = router;
