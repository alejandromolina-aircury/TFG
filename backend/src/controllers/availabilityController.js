// backend/src/controllers/availabilityController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const RESERVATION_DURATION_MINUTES = 120; // 2 horas por defecto

// --- FUNCIÓN AUXILIAR (El cerebro de la comprobación) ---
// Esta función nos dice si una lista de mesas está libre en una hora concreta
async function findFreeTables(tables, dateStr, timeStr) {
  const startDateTime = new Date(`${dateStr}T${timeStr}:00`);
  const endDateTime = new Date(startDateTime.getTime() + RESERVATION_DURATION_MINUTES * 60000);

  const availableTables = [];

  for (const table of tables) {
    // Buscamos conflictos SOLO para esta mesa y esta hora
    const collisions = await prisma.booking.findMany({
      where: {
        tableId: table.id,
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        date: { lt: endDateTime } // Optimización básica DB
      }
    });

    // Filtro JS preciso
    const hasConflict = collisions.some(booking => {
      const duration = booking.duration || 120;
      const bookingEnd = new Date(booking.date.getTime() + duration * 60000);
      return booking.date < endDateTime && bookingEnd > startDateTime;
    });

    if (!hasConflict) {
      availableTables.push(table);
    }
  }

  return availableTables;
}

// --- CONTROLADOR PRINCIPAL ---
exports.checkAvailability = async (req, res) => {
  try {
    const { date, time, pax, zoneId } = req.body;
    const numPax = parseInt(pax);
    
    console.log(`🔎 Buscando disponibilidad para: ${date} ${time} (${numPax} pax)`);

    // 1. Obtener mesas candidatas (Por capacidad y zona)
    // Esto se hace UNA vez, no hace falta repetirlo para cada horario
    const candidateTables = await prisma.table.findMany({
      where: {
        isActive: true,
        minCapacity: { lte: numPax },
        maxCapacity: { gte: numPax },
        ...(zoneId && { zoneId: parseInt(zoneId) })
      }
    });

    if (candidateTables.length === 0) {
      return res.json({ 
        available: false, 
        message: 'No existen mesas con esa capacidad en esta zona.',
        suggestions: [] 
      });
    }

    // 2. Comprobar la HORA EXACTA solicitada
    const tablesAtRequestedTime = await findFreeTables(candidateTables, date, time);

    if (tablesAtRequestedTime.length > 0) {
      // ¡ÉXITO! Hay sitio a la hora que quería
      return res.json({
        available: true,
        time: time,
        tables: tablesAtRequestedTime
      });
    }

    // 3. SI FALLA: MODO SUGERENCIAS (Smart Search) 🧠
    console.log('⚠️ Hora solicitada llena. Calculando alternativas...');
    
    // Definimos los offsets en minutos ( -30, +30, -60, +60 )
    const offsets = [-30, 30, -60, 60];
    const suggestions = [];

    for (const offset of offsets) {
      // Calcular la nueva hora
      const baseDate = new Date(`${date}T${time}:00`);
      const newDateObj = new Date(baseDate.getTime() + offset * 60000);
      
      // Formatear HH:mm (Ej: 21:30)
      const newTimeStr = newDateObj.toTimeString().slice(0, 5);

      // Comprobar disponibilidad para este nuevo horario
      const tablesAtAlternative = await findFreeTables(candidateTables, date, newTimeStr);

      if (tablesAtAlternative.length > 0) {
        suggestions.push({
          time: newTimeStr,
          tablesCount: tablesAtAlternative.length // Le decimos cuántas mesas hay (opcional)
        });
      }
    }

    // 4. Responder con las sugerencias
    res.json({
      available: false,
      message: 'Lo sentimos, a esa hora estamos completos.',
      suggestions: suggestions.sort((a, b) => a.time.localeCompare(b.time)) // Ordenar por hora
    });

  } catch (error) {
    console.error('❌ Error en availabilityController:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};