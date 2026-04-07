const prisma = require('../../config/database');
const { asyncHandler } = require('../../middleware/errorHandler');

exports.getConfig = asyncHandler(async (req, res) => {
  const configs = await prisma.systemConfig.findMany();
  
  const configMap = {};
  configs.forEach(c => configMap[c.key] = c.value);
  
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
    await prisma.systemConfig.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) }
    });
  }
  
  const allConfigs = await prisma.systemConfig.findMany();
  const configMap = {};
  allConfigs.forEach(c => configMap[c.key] = c.value);

  res.json({
    status: 'success',
    message: 'Configuraciones actualizadas',
    data: configMap
  });
});
