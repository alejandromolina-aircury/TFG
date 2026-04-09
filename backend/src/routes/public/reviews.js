
const express = require('express');
const router = express.Router();
const reviewsController = require('../../controllers/reviewsController');

// GET /api/public/reviews
router.get('/', reviewsController.getGoogleReviews);

module.exports = router;
