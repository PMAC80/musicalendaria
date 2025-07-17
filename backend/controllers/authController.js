// backend/controllers/authController.js

// Importa bcrypt para encriptar contraseñas
const bcrypt = require('bcrypt');

// Importa el modelo de usuario
const User = require('../models/userModel');

// POST /auth/register - Registro de usuario
exports.register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Verifica si el artista es prohibido
    const prohibidos = ['eminem', 'dua lipa', 'catriel', 'paco amoroso'];
    if (prohibidos.includes(nombre.toLowerCase())) {
      return res.status(403).send('Artista no permitido');
    }

    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea el usuario en la base de datos
    await User.create(nombre, email, hashedPassword, rol);

    res.status(201).send('Usuario registrado exitosamente');
  } catch (err) {
    res.status(500).send('Error en el registro');
  }
};

// POST /auth/login - Inicio de sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Busca el usuario en la base de datos
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).send('Usuario no encontrado');

    // Compara contraseñas
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send('Contraseña incorrecta');

    // Guarda datos del usuario en la sesión
    req.session.userId = user.id;
    req.session.userRole = user.rol;

    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Error al iniciar sesión');
  }
};

// GET /auth/logout - Cierra sesión del usuario
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.send('Sesión finalizada');
  });
};
