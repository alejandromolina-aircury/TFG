// backend/src/routes/backoffice/zones.js

const express = require('express');
const router = express.Router();
const zoneController = require('../../controllers/backoffice/zoneController');

// GET /api/backoffice/zones
router.get('/', zoneController.getAllZones);

module.exports = router;
