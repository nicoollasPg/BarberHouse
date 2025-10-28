const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UsuarioDao = require('../dao/UsuarioDao');

class UsuarioController {
  // LOGIN
  static async login(req, res) {
    try {
      const { correo, password } = req.body;

      if (!correo || !password) {
        return res.status(400).json({ message: 'Faltan datos' });
      }

      const usuario = await UsuarioDao.encontrarPorCorreo(correo);
      if (!usuario) {
        return res.status(401).json({ message: 'Usuario o contraseña incorrecta' });
      }

      const passwordValido = await bcrypt.compare(password, usuario.hash_contrasena);
      if (!passwordValido) {
        return res.status(401).json({ message: 'Usuario o contraseña incorrecta' });
      }

      const token = jwt.sign(
        { id: usuario.id, rol: usuario.rol, nombre_usuario: usuario.nombre_usuario },
        process.env.JWT_SECRET || 'claveultrasecreta',
        { expiresIn: '8h' }
      );

      return res.json({
        token,
        usuario: {
          id: usuario.id,
          nombre_usuario: usuario.nombre_usuario,
          correo: usuario.correo,
          rol: usuario.rol
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  // REGISTRAR
  static async registrar(req, res) {
    try {
      const { nombre_usuario, correo, dni, password, rol } = req.body;

      if (!nombre_usuario || !correo || !dni || !password || !rol) {
        return res.status(400).json({ message: 'Faltan datos' });
      }

      const hash_contrasena = await bcrypt.hash(password, 10);
      const usuarioId = await UsuarioDao.crearUsuario({
        nombre_usuario,
        hash_contrasena,
        correo,
        dni,
        rol
      });

      res.status(201).json({ message: 'Usuario creado correctamente', usuarioId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
  }

  // LISTAR BARBEROS
  static async listarBarberos(req, res) {
    try {
      const barberos = await UsuarioDao.listarBarberos();
      if (!barberos.length) {
        return res.json({ message: 'No hay barberos registrados' });
      }
      res.json(barberos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al listar barberos', error: error.message });
    }
  }
  // OBTENER TODOS LOS USUARIOS (solo admin)
static async obtenerTodos(req, res) {
  try {
    const usuarios = await UsuarioDao.obtenerTodos();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
  }
}

}

module.exports = UsuarioController;

