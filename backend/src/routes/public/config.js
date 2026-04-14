const express = require('express');
const router = express.Router();
const prisma = require('../../config/database');
const { asyncHandler } = require('../../middleware/errorHandler');

/**
 * GET /api/public/config
 * Retrieves public front-end configurations like specialties.
 */
router.get('/', asyncHandler(async (req, res) => {
  const configs = await prisma.systemConfig.findMany({
    where: {
      key: {
        in: [
          'specialties_config',
          'restaurant_name',
          'restaurant_address',
          'restaurant_phone',
          'restaurant_email'
        ]
      }
    }
  });

  const configMap = {};
  configs.forEach(c => {
    configMap[c.key] = c.value;
  });

  let parsedSpecialties = null;
  if (configMap.specialties_config) {
    try {
      parsedSpecialties = JSON.parse(configMap.specialties_config);
    } catch (e) {
      console.error('Error parsing specialties config', e);
    }
  }

  res.json({
    status: 'success',
    data: {
      specialties: parsedSpecialties,
      restaurant_name: configMap.restaurant_name || 'Mesón Marinero',
      restaurant_address: configMap.restaurant_address || 'Calle del Puerto, 12 — Alicante',
      restaurant_phone: configMap.restaurant_phone || '965 00 00 00',
      restaurant_email: configMap.restaurant_email || 'info@mesonmarinero.es'
    }
  });
}));

module.exports = router;
