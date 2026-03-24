// backend/src/controllers/backoffice/zoneController.js

const prisma = require('../../config/database');
const { asyncHandler } = require('../../middleware/errorHandler');

/**
 * GET /api/backoffice/zones
 * Lista todas las zonas con sus mesas
 */
exports.getAllZones = asyncHandler(async (req, res) => {
  const zones = await prisma.zone.findMany({
    where: { isActive: true },
    include: {
      tables: {
        where: { isActive: true },
        orderBy: { name: 'asc' }
      },
      _count: {
        select: { tables: true }
      }
    },
    orderBy: { displayOrder: 'asc' }
  });

  res.json({
    status: 'success',
    data: { zones }
  });
});

module.exports = exports;
