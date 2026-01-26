// backend/src/routes/reservations.js
const express = require('express');
const router = express.Router();

// Importamos los controladores
const availabilityController = require('../controllers/availabilityController');
const reservationController = require('../controllers/reservationController');

// Ruta 1: Buscar (Ya funcionaba)
router.post('/check', availabilityController.checkAvailability);

// Ruta 2: Crear (ESTA ES LA QUE TE FALTA)
router.post('/create', reservationController.createReservation);

module.exports = router;