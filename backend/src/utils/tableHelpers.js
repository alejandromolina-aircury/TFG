// backend/src/utils/tableHelpers.js

const { DURATION } = require('../config/constants');

/**
 * Calcula la duración estimada de una reserva según el número de comensales.
 * @param {number} pax
 * @returns {number} Duración en minutos
 */
function calculateDuration(pax) {
  if (pax <= 2) return DURATION.SMALL;    // 90 min
  if (pax <= 4) return DURATION.MEDIUM;   // 120 min
  if (pax <= 6) return DURATION.LARGE;    // 150 min
  return DURATION.GROUP;                   // 180 min
}

/**
 * Filtra mesas según capacidad mínima y máxima para un número de comensales.
 * @param {Array} tables - Array de objetos mesa
 * @param {number} pax
 * @returns {Array} Mesas que pueden acomodar a los comensales
 */
function filterTablesByCapacity(tables, pax) {
  return tables.filter(
    (table) => table.minCapacity <= pax && table.maxCapacity >= pax
  );
}

/**
 * Calcula la puntuación de una mesa para un número de comensales.
 * Prioriza mesas con el mínimo desperdicio de capacidad.
 * @param {Object} table
 * @param {number} pax
 * @returns {number} Puntuación (mayor = mejor)
 */
function scoreTable(table, pax) {
  const waste = table.maxCapacity - pax;    // Plazas libres sobrantes
  const score = 100 - waste * 10;           // Penalizar por cada plaza sobrante
  
  // Bonus si la capacidad es exacta
  if (table.maxCapacity === pax) return score + 50;
  // Bonus si solo sobra 1 plaza
  if (waste === 1) return score + 20;
  
  return score;
}

/**
 * Ordena las mesas por puntuación (mejor primero)
 * @param {Array} tables
 * @param {number} pax
 * @returns {Array} Mesas ordenadas por idoneidad
 */
function sortTablesByScore(tables, pax) {
  return [...tables].sort((a, b) => scoreTable(b, pax) - scoreTable(a, pax));
}

module.exports = {
  calculateDuration,
  filterTablesByCapacity,
  scoreTable,
  sortTablesByScore
};
