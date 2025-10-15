const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Ruta para habilitar un evento (admin)
router.put('/:id/habilitar', eventController.habilitarEvento);

// Ruta para que el admin vea todos los eventos (habilitados y no habilitados)
router.get('/pendientes', eventController.getPendingEvents);

// Ruta pública para obtener todos los eventos
router.get('/', eventController.getAllEvents);

// Ruta para crear un nuevo evento (artista)
router.post('/', eventController.createEvent);

// Ruta para eliminar un evento (admin)
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
