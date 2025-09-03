const express = require('express');
const router = express.Router();
const Event = require('../models/eventModel');

// Ruta pública para obtener todos los eventos
router.get('/', async (req, res) => {
  try {
    const eventos = await Event.getAll();
    // Adaptar los datos para el frontend
    const eventosAdaptados = eventos.map(ev => ({
      titulo: ev.titulo,
      lugar: ev.lugar,
      fecha: ev.fecha,
      hora: ev.hora || '',
      etiquetas: [ev.tipo_entrada],
      imagen: ev.enlace_flyer || '',
      artista: ev.nombre_artista,
      precio: ev.precio,
      enlaceEntradas: ev.enlace_entradas
    }));
    res.json(eventosAdaptados);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los eventos' });
  }
});


// Ruta para crear un nuevo evento (artista)
router.post('/', async (req, res) => {
  try {
    console.log('Nuevo evento recibido:', req.body);
    // Obtener el artista_id desde la sesión o el body (ajustar según tu lógica de autenticación)
    // Aquí se asume que el artista está logueado y su id está en req.session.userId
    const artistaId = req.session && req.session.userId ? req.session.userId : req.body.artista_id;
    if (!artistaId) {
      return res.status(401).json({ error: 'No autenticado como artista' });
    }
    const evento = req.body;
    await Event.create(artistaId, evento);
    res.status(201).json({ message: 'Evento enviado para revisión' });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear el evento' });
  }
});

module.exports = router;
