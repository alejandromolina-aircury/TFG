
const express = require('express');
const router = express.Router();
const closureController = require('../../controllers/backoffice/closureController');

// GET /api/backoffice/closures
router.get('/', closureController.getAllClosures);

// GET /api/backoffice/closures/history
router.get('/history', closureController.getAllClosuresHistory);

// POST /api/backoffice/closures
router.post('/', closureController.createClosure);

// DELETE /api/backoffice/closures/:id
router.delete('/:id', closureController.deleteClosure);

module.exports = router;