// backend/controllers/authController.js
// bcrypt: librería que se usa para encriptar contraseñas de manera segura antes de guardarlas en la base de datos.
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Artista = require('../models/artistaModel'); // Nuevo modelo

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

    res.status(201).send('Usuario registrado exitosamente');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el registro');
  }
};

// Login
exports.login = async (req, res) => {
  try {
    // Extrae email y password del cuerpo de la petición
    const { email, password } = req.body;
    // Busca el usuario por email en la base de datos
    const user = await User.findByEmail(email);
    // Si el usuario no existe, retorna 
    if (!user) return res.redirect('/login.html');

    // Compara la contraseña ingresada con el hash guardado
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.redirect('/login.html');

    // Guarda el ID del usuario en la sesión para mantenerlo logueado
    req.session.userId = user.id;
    // Redirecciona según el rol del usuario
    if (user.rol === 'admin') {
      res.redirect('/dashboard/admin.html');
    } else if (user.rol === 'artista') {
      res.redirect('/dashboard/artista.html');
    } else {
      res.redirect('/'); // O a una página de error
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al iniciar sesión');
  }
};

// Logout
exports.logout = (req, res) => {
  // Destruye la sesión del usuario
  req.session.destroy(() => {
    // Redirige al usuario a la página de inicio después de cerrar sesión
    res.redirect('/index.html');
  });
  };

