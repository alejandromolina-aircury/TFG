// backend/src/controllers/backoffice/shiftController.js

const prisma = require('../../config/database');
const { asyncHandler, BusinessError } = require('../../middleware/errorHandler');

/**
 * GET /api/backoffice/shifts
 * Lista todos los turnos
 */
exports.getAllShifts = asyncHandler(async (req, res) => {
  const shifts = await prisma.shift.findMany({
    orderBy: { startTime: 'asc' }
  });

  res.json({
    status: 'success',
    data: { shifts }
  });
});

/**
 * PATCH /api/backoffice/shifts/:id
 * Modificar horario o días del turno
 * Body: { startTime?, endTime?, slotInterval?, isActive?, daysOfWeek? }
 */
exports.updateShift = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { startTime, endTime, slotInterval, isActive, daysOfWeek } = req.body;

  const shift = await prisma.shift.findUnique({ where: { id: parseInt(id) } });

  if (!shift) {
    throw new BusinessError('Turno no encontrado', 'NOT_FOUND', 404);
  }

  const updateData = {};
  if (startTime !== undefined) updateData.startTime = startTime;
  if (endTime !== undefined) updateData.endTime = endTime;
  if (slotInterval !== undefined) updateData.slotInterval = parseInt(slotInterval);
  if (isActive !== undefined) updateData.isActive = Boolean(isActive);
  if (daysOfWeek !== undefined) updateData.daysOfWeek = daysOfWeek;

  const updated = await prisma.shift.update({
    where: { id: parseInt(id) },
    data: updateData
  });

  res.json({
    status: 'success',
    message: 'Turno actualizado correctamente',
    data: updated
  });
});

module.exports = exports;
