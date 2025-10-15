// Importa la biblioteca Express para crear el servidor
const express = require('express');
// Carga las variables de entorno desde el archivo .env
require('dotenv').config();
// Importa el módulo nativo de Node.js para manejar rutas de archivos
const path = require('path');

// Importa las rutas de autenticación
const authRoutes = require('./backend/routes/authRoutes');
// Importa el middleware verifyToken para proteger rutas
const { verifyToken } = require('./backend/middleware/jwtMiddleware');
// Importa las rutas relacionadas con eventos
const eventRoutes = require('./backend/routes/eventRoutes');
// Importa las rutas específicas para administradores
const adminRoutes = require('./backend/routes/adminRoutes');
// Importa las rutas relacionadas con usuarios
const userRoutes = require('./backend/routes/userRoutes');

// Crea una instancia de la aplicación Express
const app = express();
// Define el puerto en el que el servidor escuchará (desde .env o 3000 por defecto)
const PORT = process.env.PORT || 3000;

// Middleware para procesar datos JSON en las solicitudes
app.use(express.json());
// Middleware para procesar datos de formularios (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos desde la carpeta frontend
app.use(express.static('./frontend'));
// Conecta las rutas de autenticación bajo el prefijo /auth
app.use('/auth', authRoutes);
// Conecta las rutas de eventos bajo el prefijo /api/eventos
app.use('/api/eventos', eventRoutes);
// Conecta las rutas de administrador bajo el prefijo /api/admin
app.use('/api/admin', adminRoutes);
// Conecta las rutas de usuarios bajo el prefijo /api/users
app.use('/api/users', userRoutes);

// Ruta protegida: muestra el dashboard del artista por defecto si acceden a /dashboard o /dashboard/
app.get(['/dashboard', '/dashboard/'], verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dashboard/artista.html'));
});

// Ruta protegida: muestra el dashboard del administrador
app.get('/dashboard/admin.html', verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dashboard/admin.html'));
});

// Ruta protegida: muestra el dashboard del artista
app.get('/dashboard/artista.html', verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dashboard/artista.html'));
});

// Inicia el servidor y escucha en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
