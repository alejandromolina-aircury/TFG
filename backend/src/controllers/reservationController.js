// backend/src/controllers/public/reservationController.js

const crypto = require('crypto');
const prisma = require('../config/database');
const customerService = require('../services/customerService');
const emailService = require('../services/emailService');
const tableAssignmentService = require('../services/tableAssignmentService');
const validationService = require('../services/validationService');
const { asyncHandler, BusinessError } = require('../middleware/errorHandler');
const { combineDateAndTime } = require('../utils/dateHelpers');
const { calculateDuration } = require('../utils/tableHelpers');
const { BOOKING_SOURCE, BOOKING_STATUS } = require('../config/constants');

/**
 * POST /api/public/reservations
 * Crea una reserva desde el frontend público
 * Body: {
 *   date, time, pax, zoneId?,
 *   customer: { email, firstName, lastName, phone, allergens? },
 *   specialRequests?
 * }
 */
exports.createReservation = asyncHandler(async (req, res) => {
  const {
    date,
    time,
    pax,
    zoneId,
    customer: customerData,
    specialRequests
  } = req.body;
  
  // Validación completa de los datos
  validationService.validateBookingData({
    date,
    time,
    pax,
    ...customerData
  });
  
  console.log(`📝 Creando reserva: ${date} ${time} (${pax} pax) - ${customerData.email}`);
  
  // Sanitizar datos
  const sanitizedRequests = validationService.sanitizeText(specialRequests, 500);
  const sanitizedAllergens = validationService.validateAllergens(customerData.allergens);
  
  // Crear/actualizar cliente
  const { customer, isNew } = await customerService.findOrCreateCustomer(
    customerData.email,
    {
      ...customerData,
      allergens: sanitizedAllergens
    }
  );
  
  // Comprobar si está en lista negra
  if (customer.isBlacklisted) {
    throw new BusinessError(
      'No se pueden crear reservas para este cliente. Contacte al restaurante.',
      'CUSTOMER_BLACKLISTED',
      403
    );
  }
  
  // Asignar mesa óptima
  const assignment = await tableAssignmentService.assignOptimalTable(
    parseInt(pax),
    date,
    time,
    zoneId ? parseInt(zoneId) : null
  );
  
  // Generar token de confirmación único
  const confirmationToken = crypto.randomBytes(16).toString('hex');
  
  // Calcular duración
  const duration = calculateDuration(parseInt(pax));
  const dateTime = combineDateAndTime(date, time);
  
  // Crear la reserva
  const booking = await prisma.booking.create({
    data: {
      date: dateTime,
      duration,
      pax: parseInt(pax),
      status: BOOKING_STATUS.CONFIRMED,
      source: BOOKING_SOURCE.WEB,
      specialRequests: sanitizedRequests || null,
      customerId: customer.id,
      tableId: assignment.type === 'SINGLE' ? assignment.table.id : assignment.tables[0].id,
      confirmationToken,
      confirmedAt: new Date()
    },
    include: {
      customer: true,
      table: {
        include: { zone: true }
      }
    }
  });
  
  console.log(`✅ Reserva creada: ${booking.id}`);
  
  // Enviar email de confirmación
  emailService.sendBookingConfirmation(booking, customer);
  
  res.status(201).json({
    status: 'success',
    message: isNew 
      ? `¡Reserva confirmada! Te hemos enviado un email de confirmación a ${customer.email}`
      : `¡Bienvenido de nuevo, ${customer.firstName}! Reserva confirmada.`,
    data: {
      booking: {
        id: booking.id,
        date: booking.date,
        pax: booking.pax,
        duration: `${booking.duration} minutos`,
        status: booking.status
      },
      customer: {
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        isReturningCustomer: !isNew
      },
      table: {
        name: booking.table.name,
        zone: booking.table.zone?.name,
        ...(assignment.type === 'COMBINATION' && {
          note: assignment.message
        })
      }
    }
  });
});

/**
 * GET /api/public/reservations/:confirmationCode
 * Obtiene detalles de una reserva por código de confirmación
 */
exports.getReservationByCode = asyncHandler(async (req, res) => {
  const { confirmationCode } = req.params;
  
  if (!confirmationCode) {
    throw new BusinessError('Código de confirmación requerido', 'MISSING_CODE', 400);
  }
  
  const booking = await prisma.booking.findUnique({
    where: { confirmationToken: confirmationCode },
    include: {
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true
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
    data: {
      booking: {
        id: booking.id,
        date: booking.date,
        pax: booking.pax,
        duration: booking.duration,
        status: booking.status,
        specialRequests: booking.specialRequests,
        createdAt: booking.createdAt
      },
      customer: booking.customer,
      table: {
        name: booking.table?.name,
        zone: booking.table?.zone?.name
      }
    }
  });
});

/**
 * PATCH /api/public/reservations/:confirmationCode/cancel
 * Cancela una reserva
 */
exports.cancelReservation = asyncHandler(async (req, res) => {
  const { confirmationCode } = req.params;
  
  const booking = await prisma.booking.findUnique({
    where: { confirmationToken: confirmationCode },
    include: { customer: true }
  });
  
  if (!booking) {
    throw new BusinessError('Reserva no encontrada', 'NOT_FOUND', 404);
  }
  
  // Comprobar que no esté ya cancelada
  if (booking.status === BOOKING_STATUS.CANCELLED) {
    throw new BusinessError('Esta reserva ya está cancelada', 'ALREADY_CANCELLED', 400);
  }
  
  // Comprobar que no esté ya completada
  if (booking.status === BOOKING_STATUS.COMPLETED) {
    throw new BusinessError('No se puede cancelar una reserva completada', 'ALREADY_COMPLETED', 400);
  }
  
  // Cancelar
  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: {
      status: BOOKING_STATUS.CANCELLED,
      modifiedAt: new Date()
    }
  });
  
  console.log(`❌ Reserva cancelada: ${booking.id}`);
  
  // Enviar email de cancelación
  emailService.sendBookingCancellation(updated, booking.customer);
  
  res.json({
    status: 'success',
    message: 'Reserva cancelada correctamente',
    data: {
      bookingId: updated.id,
      status: updated.status
    }
  });
});

/**
 * PATCH /api/public/reservations/:confirmationCode/reconfirm
 * Reconfirma asistencia 24h antes
 */
exports.reconfirmReservation = asyncHandler(async (req, res) => {
  const { confirmationCode } = req.params;
  
  const booking = await prisma.booking.findUnique({
    where: { reconfirmToken: confirmationCode }
  });
  
  if (!booking) {
    throw new BusinessError('Reserva no encontrada', 'NOT_FOUND', 404);
  }
  
  if (booking.status !== BOOKING_STATUS.CONFIRMED) {
    throw new BusinessError('Esta reserva no puede ser reconfirmada', 'INVALID_STATUS', 400);
  }
  
  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: {
      status: BOOKING_STATUS.RECONFIRMED,
      reconfirmedAt: new Date()
    }
  });
  
  res.json({
    status: 'success',
    message: '¡Gracias por confirmar tu asistencia!',
    data: {
      bookingId: updated.id,
      status: updated.status
    }
  });
});

module.exports = exports;