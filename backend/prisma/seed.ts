// backend/prisma/seed.ts
import { PrismaClient, BookingStatus, Language } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 INICIANDO SEEDING DEL SISTEMA COMPLETO...')

  // 1. LIMPIEZA PROFUNDA (Orden inverso para evitar errores de claves foráneas)
  // Borramos primero lo que depende de otros (Hijos), luego los Padres.
  await prisma.waitlist.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.table.deleteMany()
  await prisma.zone.deleteMany()
  await prisma.customer.deleteMany()

  console.log('🧹 Base de datos limpia y lista.')

  // ------------------------------------------------------------------
  // 2. CREACIÓN DE ZONAS
  // ------------------------------------------------------------------
  const salon = await prisma.zone.create({
    data: { name: 'Salón Principal', isActive: true }
  })
  
  const terraza = await prisma.zone.create({
    data: { name: 'Terraza (Vistas)', isActive: true } // Ideal para verano
  })

  const vip = await prisma.zone.create({
    data: { name: 'Sala Privada VIP', isActive: true }
  })

  console.log('✅ 3 Zonas creadas.')

  // ------------------------------------------------------------------
  // 3. CREACIÓN DE MESAS (Infraestructura)
  // ------------------------------------------------------------------
  
  // -- Mesas del Salón (Mix de tamaños) --
  // Creamos 10 mesas: Las pares son de 4 personas, las impares de 2.
  const mesasSalonData = []
  for (let i = 1; i <= 10; i++) {
    mesasSalonData.push({
      name: `Mesa S-${i}`,
      minCapacity: 1,
      maxCapacity: i % 2 === 0 ? 4 : 2, 
      zoneId: salon.id
    })
  }
  // Una mesa grande para familias en el salón
  mesasSalonData.push({ name: 'Mesa S-GRANDE', minCapacity: 5, maxCapacity: 10, zoneId: salon.id })
  
  // -- Mesas Terraza (Solo parejas y grupos pequeños) --
  const mesasTerrazaData = []
  for (let i = 1; i <= 5; i++) {
    mesasTerrazaData.push({
      name: `Terraza T-${i}`,
      minCapacity: 1,
      maxCapacity: 4,
      zoneId: terraza.id
    })
  }

  // -- Mesa VIP (Exclusiva) --
  const mesaVipData = [{ name: 'Mesa Presidencial', minCapacity: 8, maxCapacity: 12, zoneId: vip.id }]

  // Insertamos todas
  await prisma.table.createMany({
    data: [...mesasSalonData, ...mesasTerrazaData, ...mesaVipData]
  })

  console.log('✅ Mesas generadas con capacidades lógicas.')

  // ------------------------------------------------------------------
  // 4. CRM DE CLIENTES (Perfiles variados)
  // ------------------------------------------------------------------
  await prisma.customer.createMany({
    data: [
      {
        email: 'cliente@normal.com',
        phone: '+34600111222',
        firstName: 'Juan',
        lastName: 'Pérez',
        language: Language.ES,
        totalVisits: 2
      },
      {
        email: 'vip@empresa.com',
        phone: '+34699999999',
        firstName: 'Victoria',
        lastName: 'Beckham',
        isVip: true,
        preferences: 'Mesa alejada de la entrada. Agua con gas.',
        language: Language.EN,
        totalVisits: 50
      },
      {
        email: 'alergico@test.com',
        phone: '+34666000666',
        firstName: 'Carlos',
        lastName: 'Nuez',
        allergens: ['Frutos Secos', 'Marisco'], // Array de Postgres
        language: Language.ES,
        totalVisits: 1
      },
      {
        email: 'blacklisted@bad.com',
        phone: '+34000000000',
        firstName: 'Denis',
        lastName: 'El Travieso',
        isBlacklisted: true, // Cliente bloqueado
        totalVisits: 0
      }
    ]
  })
  
  console.log('✅ Clientes CRM insertados.')

  // ------------------------------------------------------------------
  // 5. SIMULACIÓN DE RESERVAS (Para probar el algoritmo)
  // ------------------------------------------------------------------
  
  // Recuperamos los IDs necesarios
  const clienteNormal = await prisma.customer.findUnique({ where: { email: 'cliente@normal.com' } })
  const clienteVip = await prisma.customer.findUnique({ where: { email: 'vip@empresa.com' } })
  
  // Recuperamos una mesa específica para ocuparla (La primera del salón)
  const mesaOcupada = await prisma.table.findFirst({ where: { name: 'Mesa S-1' } })

  if (!clienteNormal || !clienteVip || !mesaOcupada) return

  // FECHAS DINÁMICAS (Para que el seed sirva siempre)
  const hoy = new Date()
  
  // -- ESCENARIO 1: Reserva Pasada (Historial) --
  const fechaPasada = new Date(hoy)
  fechaPasada.setDate(fechaPasada.getDate() - 7) // Hace una semana
  
  await prisma.booking.create({
    data: {
      date: fechaPasada,
      pax: 2,
      status: BookingStatus.COMPLETED,
      customerId: clienteNormal.id,
      tableId: mesaOcupada.id
    }
  })

  // -- ESCENARIO 2: Reserva Futura OCUPANDO MESA (Conflicto) --
  // Mañana a las 21:00
  const mananaNoche = new Date(hoy)
  mananaNoche.setDate(mananaNoche.getDate() + 1)
  mananaNoche.setHours(21, 0, 0, 0) // 21:00:00

  await prisma.booking.create({
    data: {
      date: mananaNoche,
      pax: 2,
      status: BookingStatus.CONFIRMED, // Confirmada, por lo tanto OCUPA mesa
      customerId: clienteVip.id,
      tableId: mesaOcupada.id, // ¡Mesa S-1 ocupada!
      specialRequests: "Aniversario"
    }
  })

  // -- ESCENARIO 3: Reserva CANCELADA (No debe ocupar mesa) --
  // Mañana a las 14:00
  const mananaMediodia = new Date(hoy)
  mananaMediodia.setDate(mananaMediodia.getDate() + 1)
  mananaMediodia.setHours(14, 0, 0, 0)

  await prisma.booking.create({
    data: {
      date: mananaMediodia,
      pax: 4,
      status: BookingStatus.CANCELLED, // Cancelada, la mesa S-1 debería salir LIBRE
      customerId: clienteNormal.id,
      tableId: mesaOcupada.id
    }
  })

  console.log('✅ Reservas de prueba creadas (Pasadas, Futuras y Canceladas).')
  console.log('🚀 SEED COMPLETADO: El sistema está listo para pruebas.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })