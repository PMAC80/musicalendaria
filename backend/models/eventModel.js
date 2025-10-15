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

// Pool de conexiones a MySQL usando mysql2/promise
const db = require('../config/database');

exports.create = async (artistaId, evento) => {
  // Validar que hora esté presente y sea válida
  const hora = evento.hora || '';

  // Validar/truncar enlace_flyer para evitar ER_DATA_TOO_LONG
  const maxFlyerLen = 255;
  let enlaceFlyer = evento.enlace_flyer || '';
  if (enlaceFlyer.length > maxFlyerLen) {
    console.warn('enlace_flyer demasiado largo, truncando a', maxFlyerLen);
    enlaceFlyer = enlaceFlyer.slice(0, maxFlyerLen);
  }

  // Insert directo a la tabla `eventos` para simplificar y evitar dependencia
  // con procedimientos almacenados que puedan tener firmas distintas.
  // Esto hace el código más simple para un proyecto educativo: enviamos
  // los campos ya validados desde el controlador y dejamos la lógica SQL
  // sencilla aquí (INSERT INTO ...).
  const fechaOnly = (evento.fecha || '').toString().split('T')[0] || null;
  // Asegurar formato de hora 'HH:MM:SS' o null
  let horaFormatted = null;
  if (hora) {
    // hora puede venir como 'HH:MM' o 'HH:MM:SS'
    horaFormatted = hora.length === 5 ? hora + ':00' : hora;
  }
  // Nota: los tipos y longitudes deben coincidir con el esquema de la tabla
  // definido en `backend/sql/script_inicial.sql`.
  const query = `INSERT INTO eventos (artista_id, titulo, fecha, hora, lugar, tipo_entrada, precio, enlace_entradas, enlace_flyer, habilitado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const [result] = await db.execute(query, [
    artistaId,
    evento.titulo,
    fechaOnly,
    horaFormatted,
    evento.lugar,
    evento.tipo_entrada,
    evento.precio,
    evento.enlace_entradas,
    enlaceFlyer,
    evento.habilitado ? 1 : 0
  ]);
  return result; // devuelve el resultado de la inserción
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

// Elimina un evento por id (eliminación física)
exports.delete = async (id) => {
  const query = 'DELETE FROM eventos WHERE id = ?';
  const [result] = await db.execute(query, [id]);
  return result;
};