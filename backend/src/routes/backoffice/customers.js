// backend/src/routes/backoffice/customers.js

const express = require('express');
const router = express.Router();
const customerController = require('../../controllers/backoffice/customerController');

// GET /api/backoffice/customers
router.get('/', customerController.getAllCustomers);

// GET /api/backoffice/customers/:id
router.get('/:id', customerController.getCustomerById);

// PATCH /api/backoffice/customers/:id
router.patch('/:id', customerController.updateCustomer);

// POST /api/backoffice/customers/:id/notes
router.post('/:id/notes', customerController.addNote);

// POST /api/backoffice/customers/:id/blacklist
router.post('/:id/blacklist', customerController.toggleBlacklist);

// POST /api/backoffice/customers/:id/vip
router.post('/:id/vip', customerController.toggleVip);

module.exports = router;