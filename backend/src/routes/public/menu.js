const express = require('express');
const router = express.Router();
const prisma = require('../../config/database');
const { asyncHandler } = require('../../middleware/errorHandler');

/**
 * GET /api/public/menu
 * Obtiene la carta completa filtrando por activos
 */
router.get('/', asyncHandler(async (req, res) => {
  const categories = await prisma.menuCategory.findMany({
    where: { isActive: true },
    include: {
      items: {
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' }
      }
    },
    orderBy: { displayOrder: 'asc' }
  });

  res.json({
    status: 'success',
    data: { categories }
  });
}));

module.exports = router;
