// server.js

// Importa Express para crear el servidor
const express = require('express');

// Importa dotenv para manejar variables de entorno
require('dotenv').config();

// Importa express-session para manejar sesiones de usuario
const session = require('express-session');

// Importa rutas de autenticación (login, registro, logout)
const authRoutes = require('./backend/routes/authRoutes');

//const authMiddleware = require('./middleware/authMiddleware');

// Crea la app de Express
const app = express();

// Puerto configurado por variable de entorno o 3000 por defecto
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON en requests
app.use(express.json());

// Middleware para parsear datos de formularios (urlencoded)
app.use(express.urlencoded({ extended: true }));

// Configura la sesión del usuario
app.use(session({
  secret: process.env.SESSION_SECRET || 'claveSecreta123', // Clave secreta para firmar la sesión
  resave: false, // No guarda la sesión si no hubo cambios
  saveUninitialized: false, // No guarda sesiones vacías
}));

// Sirve archivos estáticos desde el frontend (html, css, js)
app.use(express.static('./frontend'));

const authMiddleware = require('./backend/middleware/authMiddleware');

app.get('/dashboard', authMiddleware, (req, res) => {
const path = require('path');

app.get('/dashboard/admin.html', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dashboard/admin.html'));
});

app.get('/dashboard/artista.html', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dashboard/artista.html'));
});
});


// Usa las rutas de autenticación en /auth
app.use('/auth', authRoutes);

app.get('/dashboard/admin.html', authMiddleware, (req, res) => {
  res.sendFile(__dirname + '/../frontend/dashboard/admin.html');
});

app.get('/dashboard/artista.html', authMiddleware, (req, res) => {
  res.sendFile(__dirname + '/../frontend/dashboard/artista.html');
});

// Inicia el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
