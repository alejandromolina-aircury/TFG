# 🗄️ Esquema de Base de Datos

Este documento detalla el modelo de datos utilizado en el Sistema de Gestión de Restaurantes. La persistencia se gestiona mediante **PostgreSQL** y el acceso a datos se realiza a través de **Prisma ORM**.

## 📊 Diagrama de Entidad-Relación

```mermaid
erDiagram
    STAFF ||--o{ BOOKING : "asigna/gestiona"
    CUSTOMER ||--o{ BOOKING : "realiza"
    CUSTOMER ||--o{ CUSTOMERNOTE : "tiene"
    CUSTOMER ||--o{ WAITLIST : "se une a"
    ZONE ||--o{ TABLE : "contiene"
    TABLE ||--o{ BOOKING : "es asignada a"
    SHIFT ||--o{ CLOSURE : "se ve afectado por"
    SHIFT ||--o{ WAITLIST : "organiza"
    MENUCATEGORY ||--o{ MENUITEM : "contiene"

    STAFF {
        string id PK
        string email UK
        string passwordHash
        string name
        StaffRole role
        boolean isActive
    }

    CUSTOMER {
        string id PK
        string email UK
        string phone
        string firstName
        string lastName
        Language language
        string[] allergens
        string preferences
        datetime birthday
        int totalVisits
        boolean isVip
        boolean isBlacklisted
        string blacklistReason
        string[] tags
        int totalNoShows
        string[] previousEmails
        string[] previousPhones
        string[] previousNames
    }

    BOOKING {
        string id PK
        datetime date
        int duration
        int pax
        BookingStatus status
        string specialRequests
        string customerId FK
        int tableId FK
        string confirmationToken UK
        string reconfirmToken UK
        BookingSource source
    }

    TABLE {
        int id PK
        string name
        int minCapacity
        int maxCapacity
        int zoneId FK
        boolean isActive
    }

    ZONE {
        int id PK
        string name
        boolean isActive
        string description
        int displayOrder
    }

    SHIFT {
        int id PK
        string name
        string startTime
        string endTime
        int[] daysOfWeek
        int slotInterval
        int maxBookingsPerSlot
        boolean isActive
    }

    CLOSURE {
        string id PK
        datetime startDate
        datetime endDate
        string reason
        boolean isFullDay
        int shiftId FK
    }

    MENUCATEGORY {
        int id PK
        string name
        string description
        boolean isActive
        int displayOrder
    }

    MENUITEM {
        int id PK
        string name
        string description
        string price
        int categoryId FK
        boolean isActive
        int displayOrder
    }
```

## 📝 Descripción de Modelos

### 👥 Usuarios y Clientes
- **Staff:** Gestiona el acceso al panel de administración. Los roles pueden ser `ADMIN` o `STAFF`.
- **Customer:** Almacena la información de contacto y perfiles de fidelización. Implementa un sistema de **identidad unificada** que rastrea cambios históricos de emails, teléfonos y nombres para evitar duplicados.

### 📅 Reservas y Flujo de Trabajo
- **Booking:** El núcleo del sistema. Registra fecha, número de comensales (PAX), estado y mesa asignada.
- **Waitlist:** Permite a los clientes apuntarse en una lista de espera cuando no hay disponibilidad inmediata.
- **BookingStatus:** Los estados incluyen `PENDING`, `CONFIRMED`, `RECONFIRMED`, `SEATED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`.

### 🏢 Organización del Local
- **Zone:** Diferentes áreas del restaurante (ej: Terraza, Salón Principal, Barra).
- **Table:** Mesas individuales con capacidades mínimas y máximas definidas.
- **Shift:** Define los horarios de operación y las reglas de reserva (intervalos, máximo de reservas por slot).

### 🍽️ Oferta Gastronómica
- **MenuCategory:** Categorías del menú (ej: Entrantes, Carnes, Postres).
- **MenuItem:** Platos individuales con descripción y precio.

---

## ⚙️ Configuraciones Técnicas
El sistema utiliza un modelo de `SystemConfig` basado en clave-valor para ajustes dinámicos sin necesidad de cambios en el código (ej: tiempo límite de reserva, activación de notificaciones).
