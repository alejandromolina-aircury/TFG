const express = require('express');
const router = express.Router();
const configController = require('../../controllers/backoffice/configController');

router.get('/', configController.getConfig);
router.patch('/', configController.updateConfig);

module.exports = router;
