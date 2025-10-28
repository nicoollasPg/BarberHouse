document.getElementById('formRegistro').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre_usuario = document.getElementById('nombre_usuario').value.trim();
  const numero_usuario = document.getElementById('numero_usuario').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const password = document.getElementById('password').value.trim();
  const dni = document.getElementById('dni').value.trim();
  const rol = document.getElementById('rol').value;
  const mensaje = document.getElementById('mensaje');

  if (!nombre_usuario || !correo || !dni || !password || !rol) {
    mensaje.textContent = 'Por favor, completa todos los campos.';
    mensaje.style.color = 'red';
    return;
  }

  try {
    const res = await fetch('http://localhost:3001/api/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre_usuario,
        correo,
        dni,
        password,
        rol
      })
    });

    const data = await res.json();

    if (res.ok) {
      mensaje.textContent = '    Registro exitoso, redirigiendo...';
      mensaje.style.color = 'green';
      setTimeout(() => window.location.href = 'login.html', 1500);
    } else {
      mensaje.textContent = ` ${data.message}`;
      mensaje.style.color = 'red';
    }

  } catch (error) {
    console.error('Error al registrar:', error);
    mensaje.textContent = ' Error de conexión con el servidor';
    mensaje.style.color = 'red';
  }
});
