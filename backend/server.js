// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./config/database');
require('dotenv').config();

// Importar rutas
const usuarioRoutes = require('./routes/usuarioRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

//  Servir frontend
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// 🩺 Ruta de prueba de conexión a la base de datos
app.get('/api/health', async (req, res) => {
  try {
    await pool.execute('SELECT 1 as ok');
    res.json({ status: 'OK', database: 'CONECTADO PUERTO 3306' });
  } catch (error) {
    console.error('Error DB:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rutas API (nota las barras `/api/`)
app.use('/api', usuarioRoutes);
app.use('/api', reservaRoutes);
app.use('/api/admin', adminRoutes); 

// Esta debe ir al final: para rutas desconocidas, servir el frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(` Backend corriendo en http://localhost:${PORT}`);
});
