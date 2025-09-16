const express = require('express');
const router = express.Router();
const Event = require('../models/eventModel');

// Ruta para habilitar un evento (admin)
router.put('/:id/habilitar', async (req, res) => {
  try {
    const id = req.params.id;
    await Event.habilitar(id);
    res.json({ message: 'Evento habilitado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al habilitar el evento' });
  }
});

// Ruta para que el admin vea todos los eventos (habilitados y no habilitados)
router.get('/pendientes', async (req, res) => {
  try {
    const eventos = await Event.getAllRaw();
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los eventos pendientes' });
  }
});

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
    // Usar siempre el artista_id que viene en el body (id de la tabla artistas)
    const artistaId = req.body.artista_id;
    console.log('artistaId:', artistaId);
    if (!artistaId) {
      return res.status(401).json({ error: 'No autenticado como artista' });
    }
    const evento = req.body;
    await Event.create(artistaId, evento);
    res.status(201).json({ message: 'Evento enviado para revisión' });
  } catch (err) {
    console.error('Error al crear el evento:', err);
    res.status(500).json({ error: err.message || 'Error al crear el evento' });
  }
});

module.exports = router;
