// backend/models/userModel.js

// Importa conexión a la base de datos
const db = require('../utils/db');

// Crea un nuevo usuario
exports.create = (nombre, email, password, rol) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)';
    db.query(query, [nombre, email, password, rol], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Busca un usuario por email
exports.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};
