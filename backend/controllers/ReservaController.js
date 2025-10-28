const ReservaDAO = require('../dao/ReservaDao');

const ReservaController = {
  registrar: async (req, res) => {
    try {
      const id = await ReservaDAO.crearReserva(req.body);
      res.json({ message: 'Reserva creada', id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al crear reserva' });
    }
  },

  obtenerTodas: async (req, res) => {
    try {
      const reservas = await ReservaDAO.obtenerTodas();
      res.json(reservas);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener reservas' });
    }
  }
};

module.exports = ReservaController;
