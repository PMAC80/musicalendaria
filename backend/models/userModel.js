// backend/models/userModel.js

// Importa conexión a la base de datos (promise pool)
const db = require('../config/database');
const bcrypt = require('bcrypt');

// Crea un nuevo usuario
exports.create = async (nombre, email, password, rol) => {
  const query = 'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)';
  const [result] = await db.execute(query, [nombre, email, password, rol]);
  return result;
};

// Busca un usuario por email
exports.findByEmail = async (email) => {
  const query = 'SELECT * FROM usuarios WHERE email = ? LIMIT 1';
  const [rows] = await db.execute(query, [email]);
  return rows[0];
};

exports.findById = async (id) => {
  const query = 'SELECT id, nombre, email, rol, creado_en FROM usuarios WHERE id = ? LIMIT 1';
  const [rows] = await db.execute(query, [id]);
  return rows[0];
};

exports.getAll = async () => {
  const query = 'SELECT id, nombre, email, rol, creado_en FROM usuarios ORDER BY creado_en DESC';
  const [rows] = await db.execute(query);
  return rows;
};

// Crea un nuevo administrador
exports.createAdmin = async (email, password) => {
  const [existingAdmins] = await db.execute('SELECT * FROM usuarios WHERE rol = ?', ['admin']);

  if (existingAdmins.length > 1) {
    // Keep the first admin and delete others
      for (let i = 1; i < existingAdmins.length; i++) {
        await db.execute('DELETE FROM usuarios WHERE id = ?', [existingAdmins[i].id]);
      }
  }

  if (existingAdmins.length > 0) {
    throw new Error('Ya existe un administrador registrado');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO usuarios (email, password, rol) VALUES (?, ?, ?)';
  await db.execute(query, [email, hashedPassword, 'admin']);
};
