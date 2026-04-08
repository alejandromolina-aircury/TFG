const prisma = require('../config/database');

/**
 * Obtiene la configuración combinando la base de datos con métricas calculadas
 */
async function getFullConfig() {
  const configs = await prisma.systemConfig.findMany();
  
  const configMap = {};
  configs.forEach(c => configMap[c.key] = c.value);
  
  // Calcular métricas dinámicas basadas en las mesas
  const activeTables = await prisma.table.findMany({
    where: { isActive: true }
  });

  const totalCapacity = activeTables.reduce((sum, table) => sum + table.maxCapacity, 0);
  const maxPaxInSingleTable = activeTables.reduce((max, table) => Math.max(max, table.maxCapacity), 0);
  const activeTablesCount = activeTables.length;

  // Añadir al configMap como valores dinámicos
  configMap.dynamic_max_capacity = String(totalCapacity);
  configMap.dynamic_max_pax = String(maxPaxInSingleTable);
  configMap.dynamic_active_tables = String(activeTablesCount);

  return configMap;
}

/**
 * Obtiene el número máximo de comensales permitido en una sola mesa
 */
async function getMaxPax() {
  const maxTable = await prisma.table.findFirst({
    where: { isActive: true },
    orderBy: { maxCapacity: 'desc' }
  });
  
  return maxTable ? maxTable.maxCapacity : 12; // Valor por defecto si no hay mesas
}

module.exports = {
  getFullConfig,
  getMaxPax
};
