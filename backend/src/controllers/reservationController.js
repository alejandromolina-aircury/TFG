const { PrismaClient, BookingStatus } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createReservation = async (req, res) => {
  try {
    const { 
      date, time, pax, tableId, // Datos de la reserva
      email, firstName, lastName, phone, specialRequests // Datos del Cliente (CRM)
    } = req.body;

    console.log(`📝 Creando reserva para ${email} en mesa ${tableId}`);

    // 1. Validar que la mesa sigue libre (Doble check de seguridad)
    // En un sistema real, aquí repetiríamos la lógica de availabilityController
    // para evitar que dos personas reserven la misma mesa al mismo tiempo.

    // 2. Construir la fecha completa
    const bookingDate = new Date(`${date}T${time}:00`);

    // 3. TRANSACCIÓN: Crear Cliente (o buscarlo) + Crear Reserva
    // Usamos una transacción para que si falla la reserva, no se cree el cliente "huérfano".
    const result = await prisma.$transaction(async (prisma) => {
      
      // A) Gestión del Cliente (CRM)
      // Buscamos si existe por email. Si no, lo creamos.
      let customer = await prisma.customer.findUnique({
        where: { email: email }
      });

      if (!customer) {
        console.log('👤 Cliente nuevo detectado. Creando ficha CRM...');
        customer = await prisma.customer.create({
          data: {
            email,
            firstName,
            lastName,
            phone,
            totalVisits: 1 // Primera visita
          }
        });
      } else {
        console.log('👤 Cliente recurrente. Sumando visita...');
        // Actualizamos contador de visitas
        await prisma.customer.update({
          where: { id: customer.id },
          data: { totalVisits: { increment: 1 } }
        });
      }

      // B) Crear la Reserva
      const booking = await prisma.booking.create({
        data: {
          date: bookingDate,
          pax: parseInt(pax),
          status: BookingStatus.CONFIRMED, // Confirmada directamente por ahora
          specialRequests,
          customer: { connect: { id: customer.id } }, // Conectamos con el cliente
          table: { connect: { id: parseInt(tableId) } } // Conectamos con la mesa
        }
      });

      return { booking, customer };
    });

    // 4. Respuesta
    res.json({
      success: true,
      message: 'Reserva creada con éxito',
      bookingId: result.booking.id,
      customer: result.customer.firstName
    });

  } catch (error) {
    console.error('❌ Error creando reserva:', error);
    res.status(500).json({ 
      success: false, 
      error: 'No se pudo completar la reserva.' 
    });
  }
};