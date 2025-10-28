const pool = require('../config/database');

class ReservaDAO {
  // Crear una nueva reserva
  async crearReserva(reservaData) {
    const {
      id_usuario,
      id_barbero,
      id_servicio,
      fecha_hora,
      estado,
      notas,
      codigo_promocion,
      precio_final
    } = reservaData;

    const query = `
      INSERT INTO reservas
        (id_usuario, id_barbero, id_servicio, fecha_hora, estado, notas, codigo_promocion, precio_final)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      id_usuario || null,
      id_barbero,
      id_servicio,
      fecha_hora,
      estado || 'pendiente',
      notas || null,
      codigo_promocion || null,
      precio_final || null
    ]);

    return result.insertId;
  }

  // Obtener todas las reservas (para el panel admin)
  async obtenerTodas() {
    const query = `
      SELECT 
        r.id,
        COALESCE(u.nombre_usuario, 'Invitado') AS usuario_nombre,
        b.nombre_usuario AS barbero_nombre,
        s.nombre AS servicio_nombre,
        r.fecha_hora,
        r.estado,
        r.notas,
        r.precio_final
      FROM reservas r
      LEFT JOIN usuarios u ON r.id_usuario = u.id
      INNER JOIN usuarios b ON r.id_barbero = b.id
      INNER JOIN servicios s ON r.id_servicio = s.id
      ORDER BY r.fecha_hora DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  }

  // Obtener reservas de un usuario específico
  async obtenerReservasPorUsuario(id_usuario) {
    const query = `
      SELECT 
        r.id,
        s.nombre AS servicio_nombre,
        r.fecha_hora,
        r.estado,
        r.notas,
        r.precio_final
      FROM reservas r
      INNER JOIN servicios s ON r.id_servicio = s.id
      WHERE r.id_usuario = ?
      ORDER BY r.fecha_hora DESC
    `;
    const [rows] = await pool.execute(query, [id_usuario]);
    return rows;
  }
}

module.exports = new ReservaDAO();
