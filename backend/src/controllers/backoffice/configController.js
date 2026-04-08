const prisma = require('../../config/database');
const { asyncHandler } = require('../../middleware/errorHandler');
const configService = require('../../services/configService');

exports.getConfig = asyncHandler(async (req, res) => {
  const configMap = await configService.getFullConfig();
  
  res.json({
    status: 'success',
    data: configMap
  });
});

exports.updateConfig = asyncHandler(async (req, res) => {
  const updates = req.body;
  
  const keys = Object.keys(updates);
  if (keys.length === 0) {
    return res.json({ status: 'success', data: {} });
  }

  for (const [key, value] of Object.entries(updates)) {
    // Evitar que sobrescriban las métricas dinámicas
    if (['dynamic_max_capacity', 'dynamic_max_pax', 'dynamic_active_tables'].includes(key)) continue;

    await prisma.systemConfig.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) }
    });
  }
  
  const configMap = await configService.getFullConfig();

  res.json({
    status: 'success',
    message: 'Configuraciones actualizadas',
    data: configMap
  });
});
