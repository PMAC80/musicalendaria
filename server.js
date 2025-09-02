// server.js


const express = require('express');
require('dotenv').config();
const session = require('express-session');
const path = require('path'); // Módulo nativo para rutas de archivos
const authRoutes = require('./backend/routes/authRoutes');
const authMiddleware = require('./backend/middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'claveSecreta123',
  resave: false,
  saveUninitialized: false,
}));
app.use(express.static('./frontend'));
app.use('/auth', authRoutes);

// Ruta protegida: muestra el dashboard del artista por defecto si acceden a /dashboard o /dashboard/
app.get(['/dashboard', '/dashboard/'], authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dashboard/artista.html'));
});

// Ruta protegida: dashboard del administrador
app.get('/dashboard/admin.html', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dashboard/admin.html'));
});

// Ruta protegida: dashboard del artista
app.get('/dashboard/artista.html', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dashboard/artista.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
