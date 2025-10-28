document.addEventListener('DOMContentLoaded', () => {
  loadComponents();
  initAnimations();
});

/**
 * Cargar componentes HTML dinámicamente (navbar y footer)
 */
function loadComponents() {
  // Navbar
  fetch('./assets/components/navbar.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('header').innerHTML = html;
      manejarSesionNavbar(); // actualizar estado de sesión
      agregarEventosNavbar(); // eventos navbar

      // ✅ Redirección automática si el usuario es admin
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      if (
        usuario &&
        usuario.rol === 'admin' &&
        !window.location.pathname.includes('admin.html')
      ) {
        console.log('Redirigiendo al panel de administración...');
        window.location.href = 'admin.html';
      }
    })
    .catch(err => console.error('Error al cargar el navbar:', err));

  // Footer
  fetch('./assets/components/footer.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('footer').innerHTML = html;
    })
    .catch(err => console.error('Error al cargar el footer:', err));
}
/**
 * Mostrar u ocultar opciones según si el usuario está logueado
 */
function manejarSesionNavbar() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const loginContainer = document.getElementById('login-container');

  if (!loginContainer) return;

  // Limpiar contenido previo
  loginContainer.innerHTML = '';

  if (usuario) {
    // Agregamos enlace adicional si es administrador
    const adminLink = usuario.rol === 'admin' 
      ? `<li><a class="dropdown-item" href="admin.html">Panel de Administración</a></li><li><hr class="dropdown-divider"></li>` 
      : '';

    // Si hay sesión activa → mostrar nombre y menú
    loginContainer.innerHTML = `
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle px-3 py-2 rounded-pill" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="fa-solid fa-user"></i> ${usuario.nombre_usuario}
        </a>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
          ${adminLink}
          <li><a class="dropdown-item" href="perfil.html">Ver perfil</a></li>
          <li><a class="dropdown-item" href="login.html" id="cambiarCuenta">Cambiar de cuenta</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" id="logoutBtn">Cerrar sesión</a></li>
        </ul>
      </li>
    `;
  } else {
    // Si no hay sesión activa → solo mostrar “Iniciar sesión”
    loginContainer.innerHTML = `
      <li class="nav-item" id="loginLink">
        <a class="nav-link px-3 py-2 rounded-pill" href="login.html">Iniciar sesión</a>
      </li>
    `;
  }
}


/**
 * Agregar eventos al navbar (reservar / cerrar sesión / cambiar cuenta)
 */
function agregarEventosNavbar() {
  document.addEventListener('click', (e) => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    // Botón reservar
    if (e.target.id === 'btnReservar' || e.target.closest('#btnReservar')) {
      e.preventDefault();
      if (!usuario) {
        alert('Debes iniciar sesión para hacer una reserva.');
        window.location.href = 'login.html';
      } else {
        window.location.href = 'reserva.html';
      }
    }

    // Cerrar sesión
    if (e.target.id === 'logoutBtn') {
      e.preventDefault();
      localStorage.removeItem('usuario');
      alert('Sesión cerrada correctamente.');
      window.location.href = 'index.html';
    }

    // Cambiar cuenta
    if (e.target.id === 'cambiarCuenta') {
      e.preventDefault();
      localStorage.removeItem('usuario');
      window.location.href = 'login.html';
    }
  });
}

/**
 * Animaciones suaves
 */
function initAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in');
  fadeElements.forEach(el => {
    el.style.opacity = 0;
    el.style.transition = 'opacity 1s ease-in';
    setTimeout(() => (el.style.opacity = 1), 300);
  });
}
