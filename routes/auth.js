const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Vulnerabilidad: Validación de entrada débil
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Vulnerabilidad: Sin validación de email o contraseña
    const user = new User({
      email: email,
      password: bcrypt.hashSync(password, 2), // Vulnerabilidad: rounds muy bajo
      name: name,
      createdAt: new Date()
    });

    // Vulnerabilidad: SQL Injection posible sin ORM
    await user.save();
    
    res.status(201).json({ message: 'Usuario registrado', user: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Vulnerabilidad: JWT sin expiración configurada
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // Vulnerabilidad: bcryptjs versión antigua
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Vulnerabilidad: Token sin expiración - CRÍTICO
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      global.jwtSecret
      // Falta expiresIn
    );

    // Vulnerabilidad: Envía información sensible en respuesta
    res.json({
      token: token,
      user: {
        id: user._id,
        email: user.email,
        password: user.password, // CRÍTICO: NO enviar contraseña
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: Sin autenticación en endpoint de cambio de contraseña
router.post('/change-password', async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    
    // Vulnerabilidad: Sin validar userId
    const user = await User.findById(userId);
    user.password = bcrypt.hashSync(newPassword, 2);
    await user.save();

    res.json({ message: 'Contraseña cambiada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: Endpoint de recuperación de contraseña inseguro
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Vulnerabilidad: Token predecible
    const resetToken = 'reset-' + email + '-' + Date.now();
    user.resetToken = resetToken;
    await user.save();

    // Vulnerabilidad: En producción, esto se enviaría por email sin protección
    res.json({ 
      message: 'Token de recuperación enviado',
      resetToken: resetToken // NUNCA hacer esto en producción
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
