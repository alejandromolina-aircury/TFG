// backend/src/routes/backoffice/shifts.js

const express = require('express');
const router = express.Router();
const shiftController = require('../../controllers/backoffice/shiftController');

// GET /api/backoffice/shifts
router.get('/', shiftController.getAllShifts);

// PATCH /api/backoffice/shifts/:id
router.patch('/:id', shiftController.updateShift);

module.exports = router;