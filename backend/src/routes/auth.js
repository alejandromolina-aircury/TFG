
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// POST /api/auth/login
// Iniciar sesión con email + contraseña
router.post('/login', authController.login);

// POST /api/auth/logout
// Cerrar sesión (el cliente descarta el token)
router.post('/logout', authController.logout);

// GET /api/auth/me
// Obtener datos del usuario autenticado (requiere token)
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
