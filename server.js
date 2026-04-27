require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');

const app = express();

// Vulnerabilidad: CORS mal configurado (permite cualquier origen)
app.use(cors({
  origin: "*",
  credentials: true
}));

// Vulnerabilidad: Headers de seguridad débiles
app.use(helmet({
  contentSecurityPolicy: false,
  frameguard: false
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Vulnerabilidad: Conexión a MongoDB sin autenticación y en localhost
mongoose.connect('mongodb://localhost:27017/ecommerce_db', {
  useNewUrlParser: false,
  useUnifiedTopology: false
});

// Variables globales sin validación
global.apiKey = process.env.API_KEY || 'default-insecure-key';
global.jwtSecret = 'secret-key-123'; // Credencial hardcodeada

// Rutas de la aplicación
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Vulnerabilidad: Exposición de errores en desarrollo
app.use((err, req, res, next) => {
  console.error('Error completo:', err);
  res.status(err.status || 500).json({
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    fullError: err
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;
