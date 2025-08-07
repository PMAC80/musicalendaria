// backend/controllers/authController.js
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Artista = require('../models/artistaModel'); // Nuevo modelo

// Registro
exports.register = async (req, res) => {
  try {
    const { nombre, email, password, rol, nombreArtista } = req.body;

    const prohibidos = ['eminem', 'dua lipa', 'catriel', 'paco amoroso'];
    if (rol === 'artista' && prohibidos.includes(nombreArtista.toLowerCase().trim())) {
      return res.status(403).send('Artista no permitido');
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).send('Email ya registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await User.create(nombre, email, hashedPassword, rol);

    if (rol === 'artista') {
      await Artista.create(userId, nombreArtista);
    }

    res.status(201).send('Usuario registrado exitosamente');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el registro');
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).send('Usuario no encontrado');

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send('Contraseña incorrecta');

    req.session.userId = user.id;
    req.session.userRole = user.rol;
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al iniciar sesión');
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/index.html');
  });
};
