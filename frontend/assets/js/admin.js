// ======================
// CONFIGURACIÓN GLOBAL
// ======================
const API_URL = "http://localhost:3001/api";
const token = localStorage.getItem('token');

if (!token) {
  alert("No tienes una sesión activa. Inicia sesión nuevamente.");
  window.location.href = "index.html";
}

// Encabezados comunes con token
const headersAuth = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`
};

// ======================
// FUNCIONES DE SERVICIOS
// ======================
async function cargarServicios() {
  try {
    const res = await fetch(`${API_URL}/admin/servicios`, { headers: headersAuth });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const servicios = await res.json();

    const tbody = document.querySelector("#tablaServicios tbody");
    tbody.innerHTML = "";

    servicios.forEach((s) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${s.id}</td>
        <td>${s.nombre}</td>
        <td>S/ ${s.precio}</td>
        <td>
          <button class="btn btn-warning btn-sm btnEditar" 
            data-id="${s.id}" data-nombre="${s.nombre}" data-precio="${s.precio}">Editar</button>
          <button class="btn btn-danger btn-sm btnEliminar" data-id="${s.id}">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error al cargar servicios:", err);
  }
}

async function guardarServicio(e) {
  e.preventDefault();
  const id = document.querySelector("#idServicio").value;
  const nombre = document.querySelector("#nombreServicio").value.trim();
  const precio = document.querySelector("#precioServicio").value;

  if (!nombre || !precio) {
    alert("Nombre y precio son obligatorios");
    return;
  }

  const data = { nombre, precio };
  let url = `${API_URL}/servicios`;
  let method = "POST";

  if (id) {
    url += `/${id}`;
    method = "PUT";
  }

  try {
    const res = await fetch(url, {
      method,
      headers: headersAuth,
      body: JSON.stringify(data)
    });

    const json = await res.json();
    alert(json.message);
    document.querySelector("#formServicio").reset();
    cargarServicios();
  } catch (err) {
    console.error("Error al guardar servicio:", err);
  }
}

async function eliminarServicio(id) {
  if (!confirm("¿Seguro de eliminar este servicio?")) return;
  try {
    const res = await fetch(`${API_URL}/servicios/${id}`, {
      method: "DELETE",
      headers: headersAuth
    });
    const json = await res.json();
    alert(json.message);
    cargarServicios();
  } catch (err) {
    console.error("Error al eliminar servicio:", err);
  }
}

// ======================
// FUNCIONES DE RESERVAS
// ======================
async function cargarReservas() {
  try {
    const res = await fetch(`${API_URL}/reservas`, { headers: headersAuth });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const reservas = await res.json();

    const tbody = document.querySelector("#tablaReservas tbody");
    tbody.innerHTML = "";

    reservas.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.id}</td>
        <td>${r.usuario_nombre || "Invitado"}</td>
        <td>${r.barbero_nombre || ""}</td>
        <td>${r.servicio_nombre || ""}</td>
        <td>${new Date(r.fecha_hora).toLocaleString()}</td>
        <td>${r.estado}</td>
        <td>${r.notas || ""}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error cargando reservas:", err);
  }
}

// ======================
// FUNCIONES DE BARBEROS
// ======================
async function cargarBarberos() {
  try {
    const res = await fetch(`${API_URL}/barberos`, { headers: headersAuth });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const barberos = await res.json();

    const tbody = document.querySelector("#tablaBarberos tbody");
    tbody.innerHTML = "";

    barberos.forEach((b) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${b.id}</td>
        <td>${b.nombre_usuario}</td>
        <td>${b.correo}</td>
        <td>
          <button class="btn btn-danger btn-sm">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error cargando barberos:", err);
  }
}

// ======================
// EVENTOS
// ======================
document.addEventListener("DOMContentLoaded", () => {
  cargarServicios();
  cargarReservas();
  cargarBarberos();

  document.querySelector("#formServicio").addEventListener("submit", guardarServicio);

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btnEliminar")) {
      eliminarServicio(e.target.dataset.id);
    }

    if (e.target.classList.contains("btnEditar")) {
      document.querySelector("#idServicio").value = e.target.dataset.id;
      document.querySelector("#nombreServicio").value = e.target.dataset.nombre;
      document.querySelector("#precioServicio").value = e.target.dataset.precio;
    }

    if (e.target.id === "btnCancelarServicio") {
      document.querySelector("#formServicio").reset();
    }
  });
});
