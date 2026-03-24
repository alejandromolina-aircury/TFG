// backend/src/utils/dateHelpers.js

const { AVAILABILITY } = require('../config/constants');

/**
 * Formatea una fecha a YYYY-MM-DD
 */
function formatDate(date) {
  if (!(date instanceof Date)) date = new Date(date);
  return date.toISOString().split('T')[0];
}

/**
 * Formatea una hora a HH:mm
 */
function formatTime(date) {
  if (!(date instanceof Date)) date = new Date(date);
  return date.toTimeString().slice(0, 5);
}

/**
 * Combina fecha y hora en un DateTime
 * @param {string} dateStr - "2025-02-10"
 * @param {string} timeStr - "14:30"
 * @returns {Date}
 */
function combineDateAndTime(dateStr, timeStr) {
  return new Date(`${dateStr}T${timeStr}:00`);
}

/**
 * Añade minutos a una fecha
 */
function addMinutes(date, minutes) {
  if (!(date instanceof Date)) date = new Date(date);
  return new Date(date.getTime() + minutes * 60000);
}

/**
 * Añade días a una fecha
 */
function addDays(date, days) {
  if (!(date instanceof Date)) date = new Date(date);
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Comprueba si dos rangos de tiempo se solapan
 * @param {Date} start1
 * @param {Date} end1
 * @param {Date} start2
 * @param {Date} end2
 */
function doTimeRangesOverlap(start1, end1, start2, end2) {
  return start1 < end2 && start2 < end1;
}

/**
 * Obtiene el día de la semana (0=Domingo, 6=Sábado)
 */
function getDayOfWeek(date) {
  if (!(date instanceof Date)) date = new Date(date);
  return date.getDay();
}

/**
 * Comprueba si una fecha está dentro del rango permitido
 */
function isDateInBookableRange(date) {
  const now = new Date();
  const targetDate = new Date(date);
  
  // No puede ser en el pasado
  if (targetDate < now) return false;
  
  // No puede ser más allá del máximo permitido
  const maxDate = addDays(now, AVAILABILITY.MAX_DAYS_AHEAD);
  if (targetDate > maxDate) return false;
  
  return true;
}

/**
 * Comprueba si una fecha/hora cumple el mínimo de antelación
 */
function meetsMinimumAdvanceTime(dateStr, timeStr) {
  const bookingDateTime = combineDateAndTime(dateStr, timeStr);
  const now = new Date();
  const minDateTime = addMinutes(now, AVAILABILITY.MIN_HOURS_AHEAD * 60);
  
  return bookingDateTime >= minDateTime;
}

/**
 * Genera horarios dentro de un turno
 * @param {string} startTime - "13:00"
 * @param {string} endTime - "16:00"
 * @param {number} interval - Minutos entre slots (ej: 30)
 * @returns {string[]} - ["13:00", "13:30", "14:00", ...]
 */
function generateTimeSlots(startTime, endTime, interval = 30) {
  const slots = [];
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  
  let currentMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  
  while (currentMinutes <= endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    slots.push(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
    currentMinutes += interval;
  }
  
  return slots;
}

/**
 * Comprueba si una hora está dentro de un rango de turno
 */
function isTimeInShift(timeStr, shiftStart, shiftEnd) {
  const [h, m] = timeStr.split(':').map(Number);
  const [startH, startM] = shiftStart.split(':').map(Number);
  const [endH, endM] = shiftEnd.split(':').map(Number);
  
  const minutes = h * 60 + m;
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  
  return minutes >= startMinutes && minutes <= endMinutes;
}

/**
 * Obtiene todos los días de un mes
 * @param {number} year
 * @param {number} month - 1-12
 * @returns {string[]} - ["2025-02-01", "2025-02-02", ...]
 */
function getDaysInMonth(year, month) {
  const days = [];
  const date = new Date(year, month - 1, 1);
  
  while (date.getMonth() === month - 1) {
    days.push(formatDate(new Date(date)));
    date.setDate(date.getDate() + 1);
  }
  
  return days;
}

/**
 * Formatea duración en minutos a texto legible
 */
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0 && mins > 0) return `${hours}h ${mins}min`;
  if (hours > 0) return `${hours}h`;
  return `${mins}min`;
}

/**
 * Parsea una fecha ISO a formato español
 */
function formatDateES(date) {
  if (!(date instanceof Date)) date = new Date(date);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Parsea una hora para mostrar en español
 */
function formatTimeES(timeStr) {
  return timeStr; // "14:30" ya está en formato correcto
}

module.exports = {
  formatDate,
  formatTime,
  combineDateAndTime,
  addMinutes,
  addDays,
  doTimeRangesOverlap,
  getDayOfWeek,
  isDateInBookableRange,
  meetsMinimumAdvanceTime,
  generateTimeSlots,
  isTimeInShift,
  getDaysInMonth,
  formatDuration,
  formatDateES,
  formatTimeES
};