const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// RUTAS PÚBLICAS
router.post('/registro', UsuarioController.registrar);
router.post('/login', UsuarioController.login);

// RUTA PROTEGIDA - LISTAR BARBEROS
router.get(
  '/barberos',
  authMiddleware,
  requireRole(['admin', 'recepcionista']),
  UsuarioController.listarBarberos
);

module.exports = router;



