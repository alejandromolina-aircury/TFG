
const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/backoffice/dashboardController');

// GET /api/backoffice/dashboard?date=YYYY-MM-DD
router.get('/', dashboardController.getDashboard);

module.exports = router;