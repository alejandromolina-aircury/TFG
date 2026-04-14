const express = require('express');
const router = express.Router();
const prisma = require('../../config/database');
const { asyncHandler } = require('../../middleware/errorHandler');

/**
 * GET /api/public/config
 * Retrieves public front-end configurations like specialties.
 */
router.get('/', asyncHandler(async (req, res) => {
  const specialtiesConfig = await prisma.systemConfig.findUnique({
    where: { key: 'specialties_config' }
  });

  let parsedSpecialties = null;
  if (specialtiesConfig && specialtiesConfig.value) {
    try {
      parsedSpecialties = JSON.parse(specialtiesConfig.value);
    } catch (e) {
      console.error('Error parsing specialties config', e);
    }
  }

  res.json({
    status: 'success',
    data: {
      specialties: parsedSpecialties
    }
  });
}));

module.exports = router;
