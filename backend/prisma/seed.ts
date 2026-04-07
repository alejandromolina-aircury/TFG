// backend/prisma/seed.ts
import 'dotenv/config'
import { PrismaClient, BookingStatus, Language } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 INICIANDO SEED DEL MESÓN MARINERO...')

  // 1. LIMPIEZA (orden inverso por claves foráneas)
  await prisma.waitlist.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.closure.deleteMany()
  await prisma.shift.deleteMany()
  await prisma.table.deleteMany()
  await prisma.zone.deleteMany()
  await prisma.customerNote.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.staff.deleteMany()

  console.log('🧹 Base de datos limpia.')

  // ------------------------------------------------------------------
  // 2. PERSONAL (Admin)
  // ------------------------------------------------------------------
  const passwordHash = await bcrypt.hash('admin1234', 10)

  await prisma.staff.create({
    data: {
      email: 'admin@mesonmarinero.com',
      passwordHash,
      name: 'Administrador',
      role: 'ADMIN',
      isActive: true
    }
  })

  console.log('✅ Staff admin creado: admin@mesonmarinero.com / admin1234')

  // ------------------------------------------------------------------
  // 3. TURNO: solo Comidas, Martes-Sábado, 13:30–17:00
  // daysOfWeek: 0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles,
  //             4=Jueves, 5=Viernes, 6=Sábado
  // ------------------------------------------------------------------
  await prisma.shift.createMany({
    data: [
      {
        name: 'Comidas',
        startTime: '13:30',
        endTime: '17:00',
        isActive: true,
        slotInterval: 30, // Slots: 13:30, 14:00, 14:30, 15:00, 15:30, 16:00, 16:30, 17:00
        daysOfWeek: [0, 2, 3, 4, 5, 6] // Todos los días menos Lunes (0=Domingo, 1=Lunes)
      },
      {
        name: 'Cenas',
        startTime: '20:30',
        endTime: '23:30',
        isActive: true,
        slotInterval: 30,
        daysOfWeek: [0, 2, 3, 4, 5, 6] // Todos los días menos Lunes
      }
    ]
  })

  console.log('✅ Turnos creados: Comidas y Cenas (Martes a Domingo)')

  // ------------------------------------------------------------------
  // 4. ZONA: Solo Salón Principal
  // ------------------------------------------------------------------
  const salon = await prisma.zone.create({
    data: {
      name: 'Salón Principal',
      description: 'Salón interior del restaurante',
      isActive: true,
      displayOrder: 1
    }
  })

  console.log('✅ Zona creada: Salón Principal')

  // ------------------------------------------------------------------
  // 5. MESAS del Salón Principal
  // Mix de capacidades para cubrir grupos de 1 a 12 personas
  // ------------------------------------------------------------------
  const mesasData = [
    // Mesas para 2 personas
    { name: 'Mesa 1', minCapacity: 1, maxCapacity: 2, zoneId: salon.id },
    { name: 'Mesa 2', minCapacity: 1, maxCapacity: 2, zoneId: salon.id },
    { name: 'Mesa 3', minCapacity: 1, maxCapacity: 2, zoneId: salon.id },
    { name: 'Mesa 4', minCapacity: 1, maxCapacity: 2, zoneId: salon.id },
    // Mesas para 4 personas
    { name: 'Mesa 5', minCapacity: 2, maxCapacity: 4, zoneId: salon.id },
    { name: 'Mesa 6', minCapacity: 2, maxCapacity: 4, zoneId: salon.id },
    { name: 'Mesa 7', minCapacity: 2, maxCapacity: 4, zoneId: salon.id },
    { name: 'Mesa 8', minCapacity: 2, maxCapacity: 4, zoneId: salon.id },
    { name: 'Mesa 9', minCapacity: 2, maxCapacity: 4, zoneId: salon.id },
    // Mesas para 6 personas
    { name: 'Mesa 10', minCapacity: 4, maxCapacity: 6, zoneId: salon.id },
    { name: 'Mesa 11', minCapacity: 4, maxCapacity: 6, zoneId: salon.id },
    { name: 'Mesa 12', minCapacity: 4, maxCapacity: 6, zoneId: salon.id },
    // Mesas grandes
    { name: 'Mesa 13', minCapacity: 6, maxCapacity: 8, zoneId: salon.id },
    { name: 'Mesa 14', minCapacity: 6, maxCapacity: 10, zoneId: salon.id },
    { name: 'Mesa 15', minCapacity: 8, maxCapacity: 12, zoneId: salon.id },
  ]

  await prisma.table.createMany({ data: mesasData })

  console.log(`✅ ${mesasData.length} mesas creadas en el Salón Principal`)

  // ------------------------------------------------------------------
  // 6. CLIENTES CRM DE EJEMPLO
  // ------------------------------------------------------------------
  await prisma.customer.createMany({
    data: [
      {
        email: 'juan.perez@example.com',
        phone: '+34600111222',
        firstName: 'Juan',
        lastName: 'Pérez',
        language: Language.ES,
        totalVisits: 5
      },
      {
        email: 'maria.garcia@example.com',
        phone: '+34611222333',
        firstName: 'María',
        lastName: 'García',
        isVip: true,
        preferences: 'Mesa tranquila. Agua sin gas.',
        language: Language.ES,
        totalVisits: 23,
        tags: ['VIP']
      },
      {
        email: 'carlos.nuez@example.com',
        phone: '+34666000666',
        firstName: 'Carlos',
        lastName: 'Nùñez',
        allergens: ['Frutos Secos', 'Marisco'],
        language: Language.ES,
        totalVisits: 2
      },
      {
        email: 'bloqueado@example.com',
        phone: '+34000000000',
        firstName: 'Cliente',
        lastName: 'Bloqueado',
        isBlacklisted: true,
        blacklistReason: '3 no-shows consecutivos',
        totalNoShows: 3,
        language: Language.ES,
        totalVisits: 3
      }
    ]
  })

  console.log('✅ 4 Clientes CRM de ejemplo')

  // ------------------------------------------------------------------
  // 7. RESERVAS DE PRUEBA (usando días válidos: martes a sábado)
  // ------------------------------------------------------------------
  const clienteJuan = await prisma.customer.findUnique({ where: { email: 'juan.perez@example.com' } })
  const clienteVip = await prisma.customer.findUnique({ where: { email: 'maria.garcia@example.com' } })

  const mesa5 = await prisma.table.findFirst({ where: { name: 'Mesa 5' } })
  const mesa10 = await prisma.table.findFirst({ where: { name: 'Mesa 10' } })

  if (!clienteJuan || !clienteVip || !mesa5 || !mesa10) return

  const hoy = new Date()

  // Encontrar el próximo martes
  function nextWeekday(dayOfWeek: number) {
    const date = new Date(hoy)
    const daysUntil = (dayOfWeek - date.getDay() + 7) % 7 || 7
    date.setDate(date.getDate() + daysUntil)
    date.setHours(14, 0, 0, 0) // 14:00
    return date
  }

  const proximoMartes = nextWeekday(2) // Martes
  const proximoViernes = nextWeekday(5) // Viernes

  // Reserva futura (próximo martes)
  await prisma.booking.create({
    data: {
      date: proximoMartes,
      pax: 3,
      duration: 120,
      status: BookingStatus.CONFIRMED,
      customerId: clienteJuan.id,
      tableId: mesa5.id,
      specialRequests: 'Cumpleaños de mi esposa',
      confirmationToken: 'demo-token-juan-001',
      confirmedAt: new Date()
    }
  })

  // Reserva VIP (próximo viernes)
  const viernes1730 = new Date(proximoViernes)
  viernes1730.setHours(13, 30, 0, 0)
  await prisma.booking.create({
    data: {
      date: viernes1730,
      pax: 6,
      duration: 150,
      status: BookingStatus.CONFIRMED,
      customerId: clienteVip.id,
      tableId: mesa10.id,
      confirmationToken: 'demo-token-vip-002',
      confirmedAt: new Date()
    }
  })

  // Reserva pasada (historial)
  const semanaPassada = new Date(hoy)
  semanaPassada.setDate(semanaPassada.getDate() - 7)
  semanaPassada.setHours(14, 30, 0, 0)
  await prisma.booking.create({
    data: {
      date: semanaPassada,
      pax: 2,
      duration: 90,
      status: BookingStatus.COMPLETED,
      customerId: clienteJuan.id,
      tableId: mesa5.id,
      completedAt: new Date()
    }
  })

  console.log('✅ 3 Reservas de prueba creadas')
  console.log('')
  console.log('🚀 SEED COMPLETADO. Resumen:')
  console.log('   👤 Staff: admin@mesonmarinero.com / admin1234')
  console.log('   🕐 Turnos: Comidas (13:30-17:00) y Cenas (20:30-23:30), Martes a Domingo')
  console.log('   🏢 Zona: Salón Principal')
  console.log('   🪑 15 Mesas (capacidad 1-12 pax)')
  console.log('   👥 4 Clientes CRM')
  console.log('   📅 3 Reservas de prueba')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })