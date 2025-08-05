const db = require('../utils/db');

exports.create = (artistaId, evento) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO eventos 
      (artista_id, titulo, fecha, lugar, tipo_entrada, precio, enlace_entradas, enlace_flyer) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(query, [
      artistaId, evento.titulo, evento.fecha, evento.lugar,
      evento.tipo_entrada, evento.precio, evento.enlace_entradas, evento.enlace_flyer
    ], (err, results) => {
      if (err) return reject(err);
      resolve(results.insertId);
    });
  });
};

exports.getAll = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT a.nombre_artista, e.* 
      FROM eventos e
      JOIN artistas a ON e.artista_id = a.id
      ORDER BY e.fecha
    `;
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};