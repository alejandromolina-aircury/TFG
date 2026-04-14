# 🔌 Referencia de la API

Esta guía detalla los principales endpoints disponibles en la API del Backend. Todas las rutas de administración requieren un token JWT válido en la cabecera `Authorization: Bearer <token>`.

## 📂 Rutas Públicas (`/api/public/*`)
Accesibles sin autenticación por clientes externos.

### Reservas
- **GET** `/api/public/reservations/availability` - Consulta disponibilidad de mesas para una fecha y PAX.
- **POST** `/api/public/reservations` - Crea una nueva reserva (estado PENDING).
- **GET** `/api/public/reservations/confirm/:token` - Confirma una reserva mediante el token de email.
- **DELETE** `/api/public/reservations/cancel/:token` - Cancela una reserva mediante el token.

### Menú
- **GET** `/api/public/menu` - Obtiene las categorías y items activos del menú.

---

## 📂 Rutas de Administración (`/api/backoffice/*`)
Requieren autenticación de Staff o Admin.

### Dashboard
- **GET** `/api/backoffice/dashboard/stats` - Estadísticas generales de hoy (reservas, PAX, no-shows).

### Menú (Gestión)

#### Categorías
- **GET** `/api/backoffice/menu/categories` - Lista todas las categorías con sus ítems.
- **POST** `/api/backoffice/menu/categories` - Crea una nueva categoría.
    - Body: `{ name, description, isActive, displayOrder }`
- **PUT** `/api/backoffice/menu/categories/:id` - Actualiza una categoría existente.
- **DELETE** `/api/backoffice/menu/categories/:id` - Elimina una categoría.
- **POST** `/api/backoffice/menu/categories/reorder` - Reordena las categorías basándose en un array de IDs.
    - Body: `{ ids: [id1, id2, ...] }`

#### Ítems
- **POST** `/api/backoffice/menu/items` - Crea un nuevo ítem en una categoría.
    - Body: `{ name, description, price, isActive, displayOrder, categoryId }`
- **PUT** `/api/backoffice/menu/items/:id` - Actualiza un ítem existente (datos parciales permitidos).
- **DELETE** `/api/backoffice/menu/items/:id` - Elimina un ítem.

### Reservas (Gestión)
- **GET** `/api/backoffice/bookings` - Listado filtrable de todas las reservas.
- **PATCH** `/api/backoffice/bookings/:id/status` - Cambia el estado de una reserva (SEATED, COMPLETED, etc).
- **PUT** `/api/backoffice/bookings/:id/assign` - Asigna una mesa a la reserva.

### Clientes (CRM)
- **GET** `/api/backoffice/customers` - Listado de clientes registrados.
- **GET** `/api/backoffice/customers/:id` - Detalle completo de un cliente (incluyendo historial y notas).
- **PATCH** `/api/backoffice/customers/:id/vip` - Cambia el estado VIP.

### Configuración del Local
- **GET/POST** `/api/backoffice/zones` - Gestión de zonas del restaurante.
- **GET/POST** `/api/backoffice/shifts` - Gestión de turnos y horarios.
- **GET/POST** `/api/backoffice/closures` - Gestión de cierres temporales.

---

## 🔐 Autenticación (`/api/auth/*`)
- **POST** `/api/auth/login` - Inicia sesión y devuelve un token JWT.
- **GET** `/api/auth/me` - Obtiene los datos del usuario autenticado.

---

## ⚠️ Códigos de Error Comunes
- `400 Bad Request`: Error de validación (Joi) o datos mal formados.
- `401 Unauthorized`: Token faltante o inválido.
- `403 Forbidden`: El usuario no tiene permisos para realizar esta acción.
- `404 Not Found`: El recurso solicitado no existe.
- `500 Internal Server Error`: Error inesperado en el servidor.
