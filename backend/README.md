# 🚀 Backend - Motor de Reservas

Este directorio contiene el núcleo del sistema, una API REST construida con **Express** y **Prisma**.

## 🛠️ Tecnologías Principales
- **Entorno:** Node.js
- **Framework:** Express.js
- **Base de Datos:** PostgreSQL
- **ORM:** Prisma
- **Autenticación:** JWT + bcryptjs
- **Validación:** Joi
- **Tiempo Real:** Socket.io
- **Testing:** Vitest + Supertest

## 📦 Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar el archivo `.env`:**
   Crea un archivo `.env` basado en `.env.example`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/tfg_db"
   JWT_SECRET="tu_secreto_super_seguro"
   PORT=3000
   
   # Configuración de Email (SMTP)
   EMAIL_USER="tu_email@gmail.com"
   EMAIL_PASS="tu_contraseña_aplicacion"
   ```

3. **Preparar la Base de Datos:**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **(Opcional) Cargar datos de prueba:**
   ```bash
   npm run db:seed
   ```

## 🚀 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo con Nodemon.
- `npm start`: Inicia el servidor en modo producción.
- `npm test`: Ejecuta la suite de pruebas con Vitest.
- `npm run db:studio`: Abre la interfaz visual de Prisma para explorar la base de datos.
- `npm run db:migrate`: Aplica las migraciones de base de datos.

## 📁 Estructura de Carpetas

```text
src/
├── controllers/    # Controladores de las rutas (manejo de req/res)
├── routes/         # Definición de endpoints
├── services/       # Lógica de negocio (núcleo del sistema)
├── middleware/     # Middlewares (Auth, Error handler, Validation)
├── config/         # Configuraciones globales (DB, Auth, Email)
├── utils/          # Funciones de utilidad
└── index.js        # Punto de entrada de la aplicación
```

## 🔌 API Endpoints
Consulta la [Guía de la API](./API.md) para ver la lista completa de endpoints disponibles.
