const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: false // Vulnerabilidad: Debería ser unique
  },
  password: {
    type: String,
    required: true
  },
  name: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  creditCard: {
    number: String, // Vulnerabilidad: Nunca almacenar número de tarjeta
    cvv: String, // Vulnerabilidad: Nunca almacenar CVV
    expiry: String
  },
  ssn: String, // Vulnerabilidad: Información muy sensible sin encripción
  address: String,
  phone: String,
  ipAddress: String,
  userAgent: String,
  lastLogin: Date,
  loginAttempts: Number,
  locked: Boolean,
  resetToken: String, // Sin expiración
  verificationToken: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Sin middleware de encriptación - contraseñas almacenadas en texto plano en algunos casos
userSchema.pre('save', function(next) {
  // Vulnerabilidad: No hace nada si ya está hasheada
  next();
});

module.exports = mongoose.model('User', userSchema);
