// backend/src/routes/backoffice/zones.js

const express = require('express');
const router = express.Router();
const zoneController = require('../../controllers/backoffice/zoneController');

// GET /api/backoffice/zones
router.get('/', zoneController.getAllZones);

// POST /api/backoffice/zones
router.post('/', zoneController.createZone);

// PUT /api/backoffice/zones/:id
router.put('/:id', zoneController.updateZone);

// POST /api/backoffice/zones/:zoneId/tables
router.post('/:zoneId/tables', zoneController.createTable);

// PUT /api/backoffice/zones/tables/:tableId
router.put('/tables/:tableId', zoneController.updateTable);

// DELETE /api/backoffice/zones/tables/:tableId
router.delete('/tables/:tableId', zoneController.deleteTable);

// DELETE /api/backoffice/zones/:id
router.delete('/:id', zoneController.deleteZone);

module.exports = router;
