// backend/controllers/authController.js
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Artista = require('../models/artistaModel'); // Nuevo modelo

exports.register = async (req, res) => {
  try {
    const { nombre, email, password, rol, nombreArtista } = req.body;

    // Validar si es artista y tiene nombre prohibido
    const prohibidos = ['eminem', 'dua lipa', 'catriel', 'paco amoroso'];
    if (rol === 'artista' && prohibidos.includes(nombreArtista.toLowerCase().trim())) {
      return res.status(403).send('Artista no permitido');
    }

    // Verificar si el email ya existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).send('Email ya registrado');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const userId = await User.create(nombre, email, hashedPassword, rol);

    // Si es artista, crear registro en tabla artistas
    if (rol === 'artista') {
      await Artista.create(userId, nombreArtista);
    }

    res.status(201).send('Usuario registrado exitosamente');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el registro');
  }
};

// ... (login y logout igual que antes)