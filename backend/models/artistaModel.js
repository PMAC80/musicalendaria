const db = require('../utils/db');

exports.create = (usuarioId, nombreArtista) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO artistas (usuario_id, nombre_artista) VALUES (?, ?)';
    db.query(query, [usuarioId, nombreArtista], (err, results) => {
      if (err) return reject(err);
      resolve(results.insertId);
    });
  });
};

exports.findByUserId = (usuarioId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM artistas WHERE usuario_id = ?';
    db.query(query, [usuarioId], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};