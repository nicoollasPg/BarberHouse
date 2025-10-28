// assets/js/reserva.js
document.addEventListener('DOMContentLoaded', () => {
  // Verificar token de sesión
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Debes iniciar sesión para reservar');
    window.location.href = 'login.html';
    return;
  }

  const reservaForm = document.getElementById('reservaForm');

  reservaForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      // Obtener usuario logueado
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      if (!usuario || !usuario.id) {
        alert('Usuario no válido. Inicia sesión nuevamente.');
        window.location.href = 'login.html';
        return;
      }

      // Obtener datos del formulario
      const barberoId = parseInt(document.getElementById('barbero').value);
      const servicioId = parseInt(document.getElementById('service').value);
      const fecha = document.getElementById('date').value;
      const hora = document.getElementById('time').value;
      const fecha_hora = `${fecha} ${hora}:00`; // Formato YYYY-MM-DD HH:MM:SS

      const reserva = {
        id_usuario: usuario.id,
        id_barbero: barberoId,
        id_servicio: servicioId,
        fecha_hora,
        codigo_promocion: document.getElementById('codigo_prom').value || null,
        notas: document.getElementById('name').value
      };

      // Validar campos obligatorios
      if (!barberoId || !servicioId || !fecha || !hora) {
        alert('Faltan datos obligatorios');
        return;
      }

      // Enviar la reserva al backend
      const res = await fetch('http://localhost:3001/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reserva)
      });

      const data = await res.json();

      if (res.ok) {
        alert('Reserva confirmada con éxito');
        reservaForm.reset();
      } else {
        alert(data.message || 'Error al registrar la reserva');
      }
    } catch (err) {
      console.error('Error al enviar la reserva:', err);
      alert('Error al enviar la reserva');
    }
  });
});
