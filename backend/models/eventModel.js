// Habilita un evento por id
exports.habilitar = async (id) => {
  const query = 'UPDATE eventos SET habilitado = 1 WHERE id = ?';
  await db.query(query, [id]);
};
// Devuelve todos los eventos, habilitados o no (para admin)
exports.getAllRaw = async () => {
  const query = `
    SELECT a.nombre_artista, e.* 
    FROM eventos e
    JOIN artistas a ON e.artista_id = a.id
    ORDER BY e.fecha
  `;
  const [results] = await db.query(query);
  return results;
};

const mysql = require('mysql2/promise');
require('dotenv').config();

// Creamos un pool de conexiones usando la API de promesas
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

exports.create = async (artistaId, evento) => {
  const query = `CALL agregar_evento(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const [result] = await db.execute(query, [
    artistaId,
    evento.titulo,
    evento.fecha,
    evento.lugar,
    evento.tipo_entrada,
    evento.precio,
    evento.enlace_entradas,
    evento.enlace_flyer,
    evento.habilitado || false
  ]);
  return true; // Adjusted to match the original logic
};

exports.getAll = async () => {
  const query = `
    SELECT a.nombre_artista, e.* 
    FROM eventos e
    JOIN artistas a ON e.artista_id = a.id
    WHERE e.habilitado = 1
    ORDER BY e.fecha
  `;
  const [results] = await db.query(query);
  return results;
};