const db = require('../utils/db');

const artistaModel = {
  create: (userId, nombreArtista) => {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO artistas (user_id, nombre_artista) VALUES (?, ?)';
      db.query(query, [userId, nombreArtista], (err, results) => {
        if (err) return reject(err);
        resolve(results.insertId);
      });
    });
  },

  findByUserId: async (userId) => {
    const query = 'SELECT * FROM artistas WHERE user_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  }
};

module.exports = artistaModel;