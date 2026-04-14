
const prisma = require('../../config/database');
const customerService = require('../../services/customerService');
const tableAssignmentService = require('../../services/tableAssignmentService');
const validationService = require('../../services/validationService');
const { asyncHandler, BusinessError } = require('../../middleware/errorHandler');
const { combineDateAndTime, formatDate, formatTime } = require('../../utils/dateHelpers');
const { calculateDuration } = require('../../utils/tableHelpers');
const { BOOKING_SOURCE, BOOKING_STATUS } = require('../../config/constants');

/**
 * GET /api/backoffice/bookings
 * Lista todas las reservas con filtros
 * Query params: date?, status?, zoneId?, customerId?, limit?, page?
 */
exports.getAllBookings = asyncHandler(async (req, res) => {
  const { date, status, zoneId, customerId, limit = 50, page = 1 } = req.query;
  
  const whereClause = {};
  
  // Filtro por fecha (usando la hora local del sistema/restaurante)
  if (date) {
    // Forzamos que se interprete como el inicio y fin del día en la zona horaria local
    const startOfDay = new Date(`${date}T00:00:00.000`);
    const endOfDay = new Date(`${date}T23:59:59.999`);
    
    whereClause.date = {
      gte: startOfDay,
      lte: endOfDay
    };
  }
  
  // Filtro por estado
  if (status) {
    whereClause.status = status;
  }
  
  // Filtro por zona
  if (zoneId) {
    whereClause.table = {
      zoneId: parseInt(zoneId)
    };
  }
  
  // Filtro por cliente
  if (customerId) {
    whereClause.customerId = customerId;
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [allMatching, total] = await Promise.all([
    prisma.booking.findMany({
      where: whereClause,
      select: { id: true, date: true }
    }),
    prisma.booking.count({ where: whereClause })
  ]);

  const now = new Date();
  // Sort by absolute difference to NOW
  allMatching.sort((a, b) => {
    return Math.abs(a.date.getTime() - now.getTime()) - Math.abs(b.date.getTime() - now.getTime());
  });

  const paginatedIds = allMatching
    .slice(skip, skip + parseInt(limit))
    .map(b => b.id);

  const bookings = await prisma.booking.findMany({
    where: {
      id: { in: paginatedIds }
    },
    include: {
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          isVip: true,
          isBlacklisted: true,
          allergens: true,
          tags: true,
          totalVisits: true
        }
      },
      table: {
        include: { zone: true }
      }
    }
  });

  // Re-sort results to match the proximity order (prisma in doesn't guarantee order)
  bookings.sort((a, b) => {
    return paginatedIds.indexOf(a.id) - paginatedIds.indexOf(b.id);
  });
  
  res.json({
    status: 'success',
    data: {
      bookings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

/**
 * GET /api/backoffice/bookings/:id
 * Obtiene detalles completos de una reserva
 */
exports.getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      customer: {
        include: {
          notes: {
            orderBy: { createdAt: 'desc' },
            take: 5
          },
          bookings: {
            where: { status: 'COMPLETED' },
            take: 5,
            orderBy: { date: 'desc' }
          }
        }
      },
      table: {
        include: { zone: true }
      }
    }
  });
  
  if (!booking) {
    throw new BusinessError('Reserva no encontrada', 'NOT_FOUND', 404);
  }
  
  res.json({
    status: 'success',
    data: booking
  });
});

/**
 * POST /api/backoffice/bookings
 * Crea una reserva desde el back-office (walk-ins, teléfono)
 */
exports.createBooking = asyncHandler(async (req, res) => {
  const {
    date,
    time,
    pax,
    tableId, // Opcional: puede asignarse automáticamente
    zoneId,
    customer: customerData,
    specialRequests,
    source = BOOKING_SOURCE.BACKOFFICE,
    assignedBy
  } = req.body;
  
  // Validar datos básicos
  validationService.validateBookingData({
    date,
    time,
    pax,
    ...customerData
  });
  
  const sanitizedRequests = validationService.sanitizeText(specialRequests, 500);
  const sanitizedAllergens = validationService.validateAllergens(customerData.allergens);
  
  // Crear/buscar cliente
  const { customer } = await customerService.findOrCreateCustomer(
    customerData.email,
    {
      ...customerData,
      allergens: sanitizedAllergens
    }
  );
  
  const duration = calculateDuration(parseInt(pax));
  const dateTime = combineDateAndTime(date, time);
  
  let assignedTable = tableId ? parseInt(tableId) : null;
  
  // Si no se especifica mesa, asignar automáticamente
  if (!assignedTable) {
    const assignment = await tableAssignmentService.assignOptimalTable(
      parseInt(pax),
      date,
      time,
      zoneId ? parseInt(zoneId) : null
    );
    assignedTable = assignment.type === 'SINGLE' 
      ? assignment.table.id 
      : assignment.tables[0].id;
  } else {
    // Validar que la mesa esté libre
    const startDateTime = dateTime;
    const endDateTime = new Date(dateTime.getTime() + duration * 60000);
    const isFree = await tableAssignmentService.isTableFree(assignedTable, startDateTime, endDateTime);
    
    if (!isFree) {
      throw new BusinessError('La mesa seleccionada no está disponible', 'TABLE_OCCUPIED', 409);
    }
  }
  
  // Crear reserva
  const booking = await prisma.booking.create({
    data: {
      date: dateTime,
      duration,
      pax: parseInt(pax),
      status: BOOKING_STATUS.CONFIRMED,
      source,
      specialRequests: sanitizedRequests || null,
      customerId: customer.id,
      tableId: assignedTable,
      assignedBy: assignedBy || 'Sistema',
      confirmedAt: new Date()
    },
    include: {
      customer: true,
      table: {
        include: { zone: true }
      }
    }
  });
  
  console.log(`✅ Reserva creada (back-office): ${booking.id}`);
  
  res.status(201).json({
    status: 'success',
    message: 'Reserva creada correctamente',
    data: booking
  });
});

/**
 * PATCH /api/backoffice/bookings/:id
 * Modifica una reserva existente
 */
exports.updateBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { date, time, pax, tableId, specialRequests, status } = req.body;
  
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { table: true }
  });
  
  if (!booking) {
    throw new BusinessError('Reserva no encontrada', 'NOT_FOUND', 404);
  }
  
  const updateData = { modifiedAt: new Date() };
  
  // Actualizar fecha/hora
  if (date && time) {
    validationService.validateBookingDate(date);
    validationService.validateBookingTime(date, time);
    updateData.date = combineDateAndTime(date, time);
  }
  
  // Actualizar comensales
  if (pax) {
    validationService.validatePaxCount(pax);
    updateData.pax = parseInt(pax);
    updateData.duration = calculateDuration(parseInt(pax));
  }
  
  // Actualizar mesa
  if (tableId && tableId !== booking.tableId) {
    // Validar disponibilidad de la nueva mesa
    const startDateTime = updateData.date || booking.date;
    const duration = updateData.duration || booking.duration;
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);
    
    const isFree = await tableAssignmentService.isTableFree(
      parseInt(tableId),
      startDateTime,
      endDateTime
    );
    
    if (!isFree) {
      throw new BusinessError('La nueva mesa no está disponible', 'TABLE_OCCUPIED', 409);
    }
    
    updateData.tableId = parseInt(tableId);
  }
  
  // Actualizar observaciones
  if (specialRequests !== undefined) {
    updateData.specialRequests = validationService.sanitizeText(specialRequests, 500);
  }
  
  // Actualizar estado
  if (status) {
    updateData.status = status;
    
    // Marcar timestamps según estado
    if (status === BOOKING_STATUS.SEATED && !booking.seatedAt) {
      updateData.seatedAt = new Date();
    }
    if (status === BOOKING_STATUS.COMPLETED && !booking.completedAt) {
      updateData.completedAt = new Date();
    }
  }
  
  const updated = await prisma.booking.update({
    where: { id },
    data: updateData,
    include: {
      customer: true,
      table: {
        include: { zone: true }
      }
    }
  });
  
  console.log(`📝 Reserva actualizada: ${id}`);
  
  res.json({
    status: 'success',
    message: 'Reserva actualizada correctamente',
    data: updated
  });
});

/**
 * DELETE /api/backoffice/bookings/:id
 * Elimina una reserva (soft delete - marca como cancelada)
 */
exports.deleteBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const booking = await prisma.booking.findUnique({
    where: { id }
  });
  
  if (!booking) {
    throw new BusinessError('Reserva no encontrada', 'NOT_FOUND', 404);
  }
  
  await prisma.booking.update({
    where: { id },
    data: {
      status: BOOKING_STATUS.CANCELLED,
      modifiedAt: new Date()
    }
  });
  
  res.json({
    status: 'success',
    message: 'Reserva cancelada correctamente'
  });
});

/**
 * PATCH /api/backoffice/bookings/:id/status
 * Cambia rápidamente el estado de una reserva
 */
exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status || !Object.values(BOOKING_STATUS).includes(status)) {
    throw new BusinessError('Estado inválido', 'INVALID_STATUS', 400);
  }
  
  const updateData = {
    status,
    modifiedAt: new Date()
  };
  
  // Marcar timestamps
  if (status === BOOKING_STATUS.SEATED) {
    updateData.seatedAt = new Date();
  }
  if (status === BOOKING_STATUS.COMPLETED) {
    updateData.completedAt = new Date();
  }
  
  // Incrementar contador de no-shows si aplica
  if (status === BOOKING_STATUS.NO_SHOW) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { customer: true }
    });
    
    if (booking) {
      await prisma.customer.update({
        where: { id: booking.customerId },
        data: { totalNoShows: { increment: 1 } }
      });
    }
  }
  
  const updated = await prisma.booking.update({
    where: { id },
    data: updateData
  });
  
  res.json({
    status: 'success',
    message: `Estado cambiado a ${status}`,
    data: updated
  });
});

/**
 * POST /api/backoffice/bookings/:id/reassign
 * Reasigna una reserva a otra mesa (drag & drop)
 */
exports.reassignTable = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { tableId } = req.body;
  
  if (!tableId) {
    throw new BusinessError('Se requiere el ID de la nueva mesa', 'MISSING_TABLE_ID', 400);
  }
  
  const result = await tableAssignmentService.reassignBooking(id, parseInt(tableId));
  
  res.json({
    status: 'success',
    ...result
  });
});

module.exports = exports;