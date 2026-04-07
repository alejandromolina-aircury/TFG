// backend/src/controllers/backoffice/zoneController.js

const prisma = require('../../config/database');
const { asyncHandler } = require('../../middleware/errorHandler');

/**
 * GET /api/backoffice/zones
 * Lista todas las zonas con sus mesas
 */
exports.getAllZones = asyncHandler(async (req, res) => {
  const showAll = req.query.all === 'true';

  const zones = await prisma.zone.findMany({
    where: showAll ? undefined : { isActive: true },
    include: {
      tables: {
        where: showAll ? undefined : { isActive: true },
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

/**
 * POST /api/backoffice/zones
 * Crea una nueva zona
 */
exports.createZone = asyncHandler(async (req, res) => {
  const { name, description, isActive, displayOrder } = req.body;
  const newZone = await prisma.zone.create({
    data: {
      name,
      description,
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0
    }
  });
  res.status(201).json({ status: 'success', data: newZone });
});

/**
 * PUT /api/backoffice/zones/:id
 * Actualiza una zona
 */
exports.updateZone = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, isActive, displayOrder } = req.body;
  
  const updatedZone = await prisma.zone.update({
    where: { id: parseInt(id, 10) },
    data: { name, description, isActive, displayOrder }
  });
  res.json({ status: 'success', data: updatedZone });
});

/**
 * POST /api/backoffice/zones/:zoneId/tables
 * Añade una mesa a una zona
 */
exports.createTable = asyncHandler(async (req, res) => {
  const { zoneId } = req.params;
  const { name, minCapacity, maxCapacity, isActive } = req.body;
  
  const newTable = await prisma.table.create({
    data: {
      name,
      minCapacity: parseInt(minCapacity, 10) || 1,
      maxCapacity: parseInt(maxCapacity, 10) || 4,
      isActive: isActive !== undefined ? isActive : true,
      zoneId: parseInt(zoneId, 10)
    }
  });
  res.status(201).json({ status: 'success', data: newTable });
});

/**
 * PUT /api/backoffice/zones/tables/:tableId
 * Actualiza una mesa
 */
exports.updateTable = asyncHandler(async (req, res) => {
  const { tableId } = req.params;
  const { name, minCapacity, maxCapacity, isActive, zoneId } = req.body;
  
  const data = {};
  if (name !== undefined) data.name = name;
  if (minCapacity !== undefined) data.minCapacity = parseInt(minCapacity, 10);
  if (maxCapacity !== undefined) data.maxCapacity = parseInt(maxCapacity, 10);
  if (isActive !== undefined) data.isActive = isActive;
  if (zoneId !== undefined) data.zoneId = parseInt(zoneId, 10);
  
  const updatedTable = await prisma.table.update({
    where: { id: parseInt(tableId, 10) },
    data
  });
  res.json({ status: 'success', data: updatedTable });
});

/**
 * DELETE /api/backoffice/zones/tables/:tableId
 * Elimina una mesa permanentemente
 */
exports.deleteTable = asyncHandler(async (req, res) => {
  const { tableId } = req.params;
  
  await prisma.table.delete({
    where: { id: parseInt(tableId, 10) }
  });
  
  res.json({ status: 'success', data: null, message: 'Mesa eliminada correctamente' });
});

/**
 * DELETE /api/backoffice/zones/:id
 * Elimina una zona permanentemente
 */
exports.deleteZone = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  await prisma.zone.delete({
    where: { id: parseInt(id, 10) }
  });
  
  res.json({ status: 'success', data: null, message: 'Zona eliminada correctamente' });
});

module.exports = exports;
