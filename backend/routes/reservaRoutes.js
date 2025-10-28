const express = require('express');
const router = express.Router();
const ReservaController = require('../controllers/ReservaController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// Crear reserva (usuario o invitado)
router.post('/reservas', ReservaController.registrar);

// Listar todas las reservas (solo admin)
router.get('/reservas', authMiddleware, requireRole(['admin']), ReservaController.obtenerTodas);

module.exports = router;
