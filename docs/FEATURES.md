# 📝 Funcionalidades del Sistema

Este documento enumera las características implementadas y funcionales del Sistema de Gestión de Restaurantes.

## 👥 Gestión de Clientes (CRM)
- **Identidad Unificada:** El sistema detecta y vincula automáticamente reservas de un mismo cliente mediante email o teléfono, incluso si los datos varían ligeramente entre reservas.
- **Historial de Cliente:** Registro de visitas totales, no-shows, alérgenos y preferencias personales.
- **Etiquetado:** Soporte para etiquetas personalizadas, marcación de clientes **VIP** y **Lista Negra (Blacklist)** con motivos específicos.
- **Multilingüe:** El sistema recuerda el idioma preferido del cliente para futuras comunicaciones.

## 📅 Reservas (Bookings)
- **Portal Público:** Formulario de reserva intuitivo para clientes externos.
- **Gestión de Estados:** Flujo completo desde `Pendiente` -> `Confirmada` -> `Sentada` -> `Completada`. Soporte para cancelaciones y no-shows.
- **Asignación de Mesas:** Asignación manual o automática del personal a mesas específicas en el local.
- **Tokens de Confirmación:** Sistema seguro para que los clientes confirmen o cancelen su reserva mediante un enlace único.
- **Reservas del Mismo Día:** Permite a los clientes reservar para la jornada actual según la configuración del sistema.

## 🛠️ Panel de Administración
- **Dashboard en Tiempo Real:** Visualización instantánea de nuevas reservas y cambios mediante WebSockets.
- **Gestión de Local:** Creación y edición de Zonas (Terraza, Salón, etc.) y Mesas con capacidades específicas.
- **Control de Turnos (Shifts):** Configuración flexible de horarios de apertura, intervalos de reserva y límites de comensales.
- **Cierres Temporales:** Capacidad para bloquear días completos o turnos específicos (festivos, eventos privados).

## 🍽️ Gestión de Menú
- **Categorías:** Organización del menú por secciones (Entrantes, Platos Principales, Postres, Bebidas).
- **Items:** Gestión de platos con nombres, descripciones y precios. Posibilidad de desactivar platos temporalmente.

## 🌍 Internacionalización (i18n)
- Soporte completo para **Español**, **Inglés** y **Francés** en la interfaz pública.
- Detección automática de idioma del navegador.

## 🧪 Calidad y Pruebas
- **Pruebas de Backend:** Tests unitarios y de integración para servicios críticos (Table assignment, Reservations).
- **Pruebas de Frontend:** Tests de componentes clave (Navbar, Wizard de Reserva).
- **Entorno Dockerizado:** Soporte para desarrollo mediante contenedores.
