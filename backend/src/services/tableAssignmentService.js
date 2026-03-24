// backend/src/services/tableAssignmentService.js

const prisma = require('../config/database');
const { calculateDuration, sortTablesByScore } = require('../utils/tableHelpers');
const { addMinutes, combineDateAndTime, doTimeRangesOverlap } = require('../utils/dateHelpers');
const { BOOKING_STATUS } = require('../config/constants');
const { BusinessError } = require('../middleware/errorHandler');

/**
 * Asigna la mesa óptima para una reserva.
 * Selecciona la mesa con mejor puntuación (mínimo desperdicio de capacidad) que esté libre.
 *
 * @param {number} pax - Número de comensales
 * @param {string} dateStr - "YYYY-MM-DD"
 * @param {string} timeStr - "HH:mm"
 * @param {number|null} zoneId - Zona preferida (opcional)
 * @returns {Promise<{type: 'SINGLE', table: Object}>}
 */
async function assignOptimalTable(pax, dateStr, timeStr, zoneId = null) {
  const duration = calculateDuration(pax);
  const startDateTime = combineDateAndTime(dateStr, timeStr);
  const endDateTime = addMinutes(startDateTime, duration);

  // Obtener mesas candidatas por capacidad (y zona si se especifica)
  const whereClause = {
    isActive: true,
    minCapacity: { lte: pax },
    maxCapacity: { gte: pax }
  };

  if (zoneId) {
    whereClause.zoneId = parseInt(zoneId);
  }

  const candidateTables = await prisma.table.findMany({
    where: whereClause,
    include: { zone: true }
  });

  if (candidateTables.length === 0) {
    throw new BusinessError(
      'No hay mesas disponibles con esa capacidad',
      'NO_TABLES_AVAILABLE',
      409
    );
  }

  // Ordenar por puntuación (mejor mesa primero)
  const rankedTables = sortTablesByScore(candidateTables, pax);

  // Intentar asignar la mejor mesa libre
  for (const table of rankedTables) {
    const isFree = await isTableFree(table.id, startDateTime, endDateTime);
    if (isFree) {
      return {
        type: 'SINGLE',
        table,
        duration,
        message: `Mesa ${table.name} asignada`
      };
    }
  }

  throw new BusinessError(
    'No hay mesas disponibles para esa fecha, hora y número de comensales',
    'NO_AVAILABILITY',
    409
  );
}

/**
 * Comprueba si una mesa está libre en un rango de tiempo.
 * @param {number} tableId
 * @param {Date} startTime
 * @param {Date} endTime
 * @returns {Promise<boolean>}
 */
async function isTableFree(tableId, startTime, endTime) {
  const conflictingBookings = await prisma.booking.findMany({
    where: {
      tableId,
      status: {
        notIn: [BOOKING_STATUS.CANCELLED, BOOKING_STATUS.NO_SHOW]
      },
      // Optimización: solo traer reservas que terminen después del inicio solicitado
      date: { lt: endTime }
    }
  });

  for (const booking of conflictingBookings) {
    const bookingStart = new Date(booking.date);
    const bookingEnd = addMinutes(bookingStart, booking.duration);

    if (doTimeRangesOverlap(startTime, endTime, bookingStart, bookingEnd)) {
      return false;
    }
  }

  return true;
}

/**
 * Reasigna una reserva a otra mesa verificando disponibilidad.
 * @param {string} bookingId
 * @param {number} newTableId
 * @returns {Promise<Object>}
 */
async function reassignBooking(bookingId, newTableId) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { table: true, customer: true }
  });

  if (!booking) {
    throw new BusinessError('Reserva no encontrada', 'NOT_FOUND', 404);
  }

  const newTable = await prisma.table.findUnique({
    where: { id: newTableId },
    include: { zone: true }
  });

  if (!newTable) {
    throw new BusinessError('Mesa no encontrada', 'TABLE_NOT_FOUND', 404);
  }

  // Verificar que la nueva mesa tiene suficiente capacidad
  if (newTable.maxCapacity < booking.pax) {
    throw new BusinessError(
      `La mesa ${newTable.name} tiene capacidad máxima de ${newTable.maxCapacity} personas, pero la reserva es para ${booking.pax}`,
      'TABLE_INSUFFICIENT_CAPACITY',
      409
    );
  }

  // Verificar disponibilidad (excluyendo la reserva actual)
  const startTime = new Date(booking.date);
  const endTime = addMinutes(startTime, booking.duration);

  const conflictingBookings = await prisma.booking.findMany({
    where: {
      tableId: newTableId,
      id: { not: bookingId }, // Excluir la reserva actual
      status: {
        notIn: [BOOKING_STATUS.CANCELLED, BOOKING_STATUS.NO_SHOW]
      },
      date: { lt: endTime }
    }
  });

  for (const conflict of conflictingBookings) {
    const conflictStart = new Date(conflict.date);
    const conflictEnd = addMinutes(conflictStart, conflict.duration);

    if (doTimeRangesOverlap(startTime, endTime, conflictStart, conflictEnd)) {
      throw new BusinessError(
        `La mesa ${newTable.name} no está disponible a esa hora`,
        'TABLE_OCCUPIED',
        409
      );
    }
  }

  // Realizar la reasignación
  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      tableId: newTableId,
      modifiedAt: new Date()
    },
    include: {
      customer: true,
      table: { include: { zone: true } }
    }
  });

  return {
    message: `Reserva reasignada a ${newTable.name}`,
    data: updated
  };
}

module.exports = {
  assignOptimalTable,
  isTableFree,
  reassignBooking
};
