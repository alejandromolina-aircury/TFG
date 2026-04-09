
const prisma = require('../../config/database');
const { asyncHandler } = require('../../middleware/errorHandler');

/**
 * GET /api/backoffice/dashboard
 * Resumen del día: reservas, comensales, estados
 * Query: date? (ISO date string, default = hoy)
 */
exports.getDashboard = asyncHandler(async (req, res) => {
  const dateParam = req.query.date;
  const targetDate = dateParam ? new Date(dateParam) : new Date();

  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Reservas del día
  const bookings = await prisma.booking.findMany({
    where: {
      date: { gte: startOfDay, lte: endOfDay }
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
          totalVisits: true,
          totalNoShows: true
        }
      },
      table: {
        include: { zone: true }
      }
    },
    orderBy: { date: 'asc' }
  });

  // Contadores por estado
  const statusCounts = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});

  // Total de comensales esperados (reservas activas)
  const activeStatuses = ['CONFIRMED', 'RECONFIRMED', 'PENDING'];
  const totalPaxExpected = bookings
    .filter(b => activeStatuses.includes(b.status))
    .reduce((sum, b) => sum + b.pax, 0);

  // Reservas activas hoy
  const activeBookings = bookings.filter(b =>
    !['CANCELLED', 'NO_SHOW', 'COMPLETED'].includes(b.status)
  ).length;

  // Mesas totales del salón
  const totalTables = await prisma.table.count({ where: { isActive: true } });

  // Próximas reservas (las siguientes 7 días)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const nextWeekEnd = new Date();
  nextWeekEnd.setDate(nextWeekEnd.getDate() + 7);
  nextWeekEnd.setHours(23, 59, 59, 999);

  const upcomingCount = await prisma.booking.count({
    where: {
      date: { gte: tomorrow, lte: nextWeekEnd },
      status: { notIn: ['CANCELLED', 'NO_SHOW'] }
    }
  });

  res.json({
    status: 'success',
    data: {
      date: targetDate.toISOString().split('T')[0],
      summary: {
        totalBookings: bookings.length,
        activeBookings,
        totalPaxExpected,
        totalTables,
        occupancyRate: totalTables > 0
          ? Math.round((activeBookings / totalTables) * 100)
          : 0,
        upcomingNext7Days: upcomingCount
      },
      statusCounts,
      bookings
    }
  });
});

module.exports = exports;
