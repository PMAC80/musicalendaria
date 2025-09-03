const db = require('../utils/db');

exports.create = (artistaId, evento) => {
  return new Promise((resolve, reject) => {
    const query = `CALL agregar_evento(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(query, [
      artistaId,
      evento.titulo,
      evento.fecha,
      evento.lugar,
      evento.tipo_entrada,
      evento.precio,
      evento.enlace_entradas,
      evento.enlace_flyer,
      evento.habilitado || false
    ], (err, results) => {
      if (err) return reject(err);
      // El procedimiento no retorna insertId, pero puedes retornar éxito
      resolve(true);
    });
  });
};

exports.getAll = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT a.nombre_artista, e.* 
      FROM eventos e
      JOIN artistas a ON e.artista_id = a.id
      WHERE e.habilitado = 1
      ORDER BY e.fecha
    `;
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};