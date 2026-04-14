
const { PrismaClient } = require('@prisma/client');

// Instancia única de Prisma (Singleton Pattern)
// Evita múltiples conexiones a la BD
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
    // Log diagnóstico local
    console.log(`[Diagnostic] Prisma Client Resolved Path: ${require.resolve('@prisma/client')}`);
    console.log(`[Diagnostic] Prisma Client Version: ${global.prisma._clientVersion}`);
    if (global.prisma._runtimeDataModel && global.prisma._runtimeDataModel.models.Customer) {
      console.log(`[Diagnostic] Customer Fields: ${global.prisma._runtimeDataModel.models.Customer.fields.map(f => f.name).join(', ')}`);
    } else {
      console.log(`[Diagnostic] Could not access Customer model info in runtimeDataModel`);
    }
  }
  prisma = global.prisma;
}

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = prisma;