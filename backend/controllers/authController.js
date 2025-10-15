// backend/controllers/authController.js
//Aqui se encuentra la Lógica de autenticación y manejo de usuarios
// bcrypt: librería que se usa para encriptar contraseñas de manera segura antes de guardarlas en la base de datos.
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Artista = require('../models/artistaModel'); // Nuevo modelo
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Registro
exports.register = async (req, res) => {
  try {
    // Extrae nombre, email, password, rol y nombreArtista del cuerpo de la petición
    const { nombre, email, password, rol, nombreArtista } = req.body;

    const prohibidos = ['eminem', 'dua lipa', 'catriel', 'paco amoroso'];
    if (rol === 'artista' && prohibidos.includes(nombreArtista.toLowerCase().trim())) {
      return res.status(403).send('Artista no permitido');
    }

    // Verifica si ya existe un usuario con ese email
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).send('Email ya registrado');
    }

    // Encripta la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await User.create(nombre, email, hashedPassword, rol);

    if (rol === 'artista') {
      await Artista.create(userId, nombreArtista);
    }

    res.status(201).json({ message: 'Usuario registrado exitosamente', redirect: '/login.html' });
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
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });
    // Emitir JWT
    const payload = { id: user.id, rol: user.rol, nombre: user.nombre };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretjwtkey', { expiresIn: '6h' });

  // No se usan sesiones; el cliente debe almacenar el token JWT

    if (user.rol === 'admin') {
      return res.json({ success: true, rol: 'admin', token, redirect: '/dashboard/admin.html' });
    } else if (user.rol === 'artista') {
      const artista = await Artista.findByUserId(user.id);
      if (!artista) {
        return res.status(403).json({ error: 'No existe artista para este usuario' });
      }
      return res.json({ success: true, rol: 'artista', token, redirect: '/dashboard/artista.html', artist_id: artista.id });
    } else {
      return res.json({ success: true, rol: user.rol, token, redirect: '/' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Logout (JWT): servidor no mantiene sesión. El cliente debe eliminar el token.
exports.logout = (req, res) => {
  res.json({ message: 'Logout: elimine el token en el cliente' });
};

