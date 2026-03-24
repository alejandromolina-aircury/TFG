// backend/src/controllers/backoffice/closureController.js

const prisma = require('../../config/database');
const { asyncHandler, BusinessError } = require('../../middleware/errorHandler');

/**
 * GET /api/backoffice/closures
 * Lista de cierres (activos y futuros)
 */
exports.getAllClosures = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const closures = await prisma.closure.findMany({
    where: {
      OR: [
        { endDate: { gte: today } },
        { endDate: null, startDate: { gte: today } }
      ]
    },
    include: { shift: true },
    orderBy: { startDate: 'asc' }
  });

  res.json({
    status: 'success',
    data: { closures }
  });
});

/**
 * GET /api/backoffice/closures/all
 * Lista todos los cierres incluyendo pasados
 */
exports.getAllClosuresHistory = asyncHandler(async (req, res) => {
  const closures = await prisma.closure.findMany({
    include: { shift: true },
    orderBy: { startDate: 'desc' },
    take: 100
  });

  res.json({
    status: 'success',
    data: { closures }
  });
});

/**
 * POST /api/backoffice/closures
 * Crear un cierre
 * Body: { startDate, endDate?, reason, isFullDay?, shiftId? }
 */
exports.createClosure = asyncHandler(async (req, res) => {
  const { startDate, endDate, reason, isFullDay = true, shiftId } = req.body;

  if (!startDate || !reason) {
    throw new BusinessError(
      'La fecha de inicio y el motivo son obligatorios',
      'MISSING_FIELDS',
      400
    );
  }

  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  if (end && end < start) {
    throw new BusinessError(
      'La fecha de fin no puede ser anterior a la de inicio',
      'INVALID_DATE_RANGE',
      400
    );
  }

  const closure = await prisma.closure.create({
    data: {
      startDate: start,
      endDate: end,
      reason: reason.trim(),
      isFullDay: Boolean(isFullDay),
      shiftId: shiftId ? parseInt(shiftId) : null,
      createdBy: req.user?.name || 'Staff'
    },
    include: { shift: true }
  });

  console.log(`🚫 Cierre creado: ${closure.reason} (${startDate})`);

  res.status(201).json({
    status: 'success',
    message: 'Cierre registrado correctamente',
    data: closure
  });
});

/**
 * DELETE /api/backoffice/closures/:id
 * Eliminar un cierre
 */
exports.deleteClosure = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const closure = await prisma.closure.findUnique({ where: { id } });

  if (!closure) {
    throw new BusinessError('Cierre no encontrado', 'NOT_FOUND', 404);
  }

  await prisma.closure.delete({ where: { id } });

  res.json({
    status: 'success',
    message: 'Cierre eliminado correctamente'
  });
});

module.exports = exports;
