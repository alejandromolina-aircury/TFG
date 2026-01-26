// backend/src/index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan'); // Logs en consola
const { PrismaClient } = require('@prisma/client');

// --- IMPORTACIÓN DE RUTAS ---
// Aquí importamos el archivo que gestiona las URLs de reservas
const reservationRoutes = require('./routes/reservations.js');

// --- CONFIGURACIÓN INICIAL ---
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// --- MIDDLEWARES (Configuración Global) ---
app.use(helmet());       // Añade seguridad básica a las cabeceras HTTP
app.use(cors());         // Permite que el Frontend (React) se comunique con el Backend
app.use(morgan('dev'));  // Muestra las peticiones en la terminal (ej: "POST /api/..." 200)
app.use(express.json()); // Permite leer los JSON que enviamos en el body (req.body)

// --- DEFINICIÓN DE RUTAS ---

// 1. Health Check (Para saber si el servidor está vivo)
app.get('/', (req, res) => {
  res.send('🚀 Motor de Reservas API: Online y Listo');
});

// 2. Rutas de la API de Reservas
// Todo lo que esté en reservationRoutes empezará por "/api/reservations"
// Ejemplo: /api/reservations/check
app.use('/api/reservations', reservationRoutes);

// 3. Ruta de Debug (Para ver las zonas y mesas rápidamente)
app.get('/api/zones', async (req, res) => {
  try {
    const zones = await prisma.zone.findMany({
      include: { tables: true } // Trae también las mesas de cada zona
    });
    res.json(zones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo zonas' });
  }
});

// --- MANEJO DE ERRORES GLOBAL ---
// Si algo explota en cualquier controlador, cae aquí
app.use((err, req, res, next) => {
  console.error('❌ Error no controlado:', err.stack);
  res.status(500).json({ 
    status: 'error', 
    message: 'Hubo un error interno en el servidor.' 
  });
});

// --- ARRANQUE DEL SERVIDOR ---
async function main() {
  try {
    // Intentamos conectar a la Base de Datos antes de abrir el puerto
    await prisma.$connect();
    console.log('✅ Base de Datos PostgreSQL: CONECTADA');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor Backend corriendo en: http://localhost:${PORT}`);
      console.log(`📡 Esperando peticiones...`);
    });
  } catch (e) {
    console.error('❌ Error fatal al iniciar el servidor:', e);
    process.exit(1);
  }
}

main();