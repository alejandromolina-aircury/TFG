
// Reglas de negocio del Mesón Marinero
// Horario: Martes-Sábado, 13:30-17:00 (solo comidas)

module.exports = {
  // 👥 REGLAS DE COMENSALES
  PAX: {
    MIN: 1,
    MAX: 12,
    CONTACT_MESSAGE: 'Para grupos de más de 12 personas, por favor contacte directamente con el restaurante.'
  },

  // ⏱️ DURACIONES DE RESERVA (en minutos)
  DURATION: {
    SMALL: 90,   // 1-2 pax
    MEDIUM: 120, // 3-4 pax
    LARGE: 150,  // 5-6 pax
    GROUP: 180   // 7+ pax
  },

  // 📧 EMAILS
  EMAIL: {
    FROM: process.env.EMAIL_FROM || 'reservas@mesonmarinero.com',
    FROM_NAME: process.env.EMAIL_FROM_NAME || 'Mesón Marinero'
  },

  // ⚠️ CRM - BLACKLIST
  BLACKLIST: {
    NO_SHOW_THRESHOLD: 3,
    AUTO_BLACKLIST: false
  },

  // 🗓️ DISPONIBILIDAD
  AVAILABILITY: {
    MAX_DAYS_AHEAD: 30,      // Máximo 30 días en el futuro
    MIN_HOURS_AHEAD: 2,      // Mínimo 2 horas de antelación
    SUGGESTION_OFFSETS: [-30, 30, -60, 60],
    MAX_SUGGESTIONS: 4
  },

  // 📊 ESTADOS
  BOOKING_STATUS: {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    RECONFIRMED: 'RECONFIRMED',
    SEATED: 'SEATED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    NO_SHOW: 'NO_SHOW'
  },

  BOOKING_SOURCE: {
    WEB: 'WEB',
    PHONE: 'PHONE',
    WALK_IN: 'WALK_IN',
    BACKOFFICE: 'BACKOFFICE'
  },

  // 🔐 TOKENS
  TOKEN: {
    CONFIRMATION_LENGTH: 32,
    RECONFIRMATION_LENGTH: 32
  }
};