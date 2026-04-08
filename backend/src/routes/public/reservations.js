// backend/src/routes/public/reservations.js

const express = require('express');
const router = express.Router();

// Importar controladores
const availabilityController = require('../../controllers/availabilityController');
const reservationController = require('../../controllers/reservationController');

// --- RUTAS DE DISPONIBILIDAD ---

// GET /api/public/reservations/availability/config
// Obtener configuración pública
router.get('/availability/config', availabilityController.getPublicConfig);

// GET /api/public/reservations/availability/calendar
// Obtener días disponibles en un mes
router.get('/availability/calendar', availabilityController.getAvailableCalendar);

// POST /api/public/reservations/availability/times
// Obtener horas disponibles para un día
router.post('/availability/times', availabilityController.getAvailableTimes);

// POST /api/public/reservations/availability/check
// Comprobar disponibilidad en hora específica + sugerencias
router.post('/availability/check', availabilityController.checkAvailability);

// --- RUTAS DE RESERVAS ---

// POST /api/public/reservations
// Crear nueva reserva
router.post('/', reservationController.createReservation);

// router.get('/:confirmationCode', reservationController.getReservationByCode);
// router.patch('/:confirmationCode/cancel', reservationController.cancelReservation);
// router.patch('/:confirmationCode/reconfirm', reservationController.reconfirmReservation);

module.exports = router;