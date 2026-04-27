const express = require('express');
const axios = require('axios');
const request = require('request');
const router = express.Router();

// Vulnerabilidad: Sin autenticación en endpoints admin
router.get('/users', async (req, res) => {
  try {
    // Sin verificar rol de admin
    const users = await User.find({});
    
    // Expone todos los datos de usuario incluyendo contraseñas
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: Eval/Code Injection
router.post('/execute-script', async (req, res) => {
  try {
    const { script } = req.body;

    // CRÍTICO: Ejecuta código arbitrario
    const result = eval(script); // NUNCA hacer esto

    res.json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: XXE (XML External Entity)
router.post('/import-xml', async (req, res) => {
  try {
    const { xmlData } = req.body;

    // Sin desabilitar entidades externas
    const parser = new xml.Parser({
      roslowlyit: false // Vulnerabilidad: XXE habilitado
    });

    const data = parser.parse(xmlData);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: Directory Listing
router.get('/files', (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');

    // Vulnerabilidad: Sin restricción de directorio
    const dirPath = req.query.dir || './uploads';
    const files = fs.readdirSync(dirPath);

    res.json({ files: files });
  } catch (error) {
    res.status(500).json({ error: error.message, dirPath });
  }
});

// Vulnerabilidad: Arbitrary File Upload
router.post('/upload-file', async (req, res) => {
  try {
    const fs = require('fs');
    const { filename, content } = req.body;

    // Sin validación de, extension
    fs.writeFileSync(`./uploads/${filename}`, content);

    res.json({ message: 'Archivo subido', path: `./uploads/${filename}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: Deserialization Attack
router.post('/deserialize', async (req, res) => {
  try {
    const { data } = req.body;

    // Sin validación de datos
    const obj = JSON.parse(data);
    
    // Si usa pickle o similar en Python, sería crítico
    const result = eval(`(${data})`);

    res.json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: Credential Exposure
router.get('/config', async (req, res) => {
  try {
    const config = {
      databaseHost: process.env.DB_HOST || 'localhost',
      databasePassword: process.env.DB_PASSWORD || 'admin123', // CRÍTICO
      apiKey: process.env.API_KEY || 'secret-api-key',
      jwtSecret: global.jwtSecret,
      stripeKey: process.env.STRIPE_KEY || 'sk_test_12345',
      databaseUrl: 'mongodb://admin:password123@localhost:27017/ecommerce'
    };

    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: Command Injection
router.post('/system-command', async (req, res) => {
  try {
    const { command } = req.body;
    const { execSync } = require('child_process');

    // CRÍTICO: Ejecuta comandos del sistema sin sanitizar
    const output = execSync(command, { encoding: 'utf8' });

    res.json({ output: output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: LDAP Injection
router.post('/ldap-search', async (req, res) => {
  try {
    const { username } = req.body;
    const ldap = require('ldapjs');

    // Sin sanitizar entrada
    const filter = `(&(uid=${username})(objectClass=*))`;

    // LDAP Injection posible
    res.json({ filter: filter });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: NoSQL Injection
router.post('/user-search', async (req, res) => {
  try {
    const { email } = req.body;

    // Vulnerabilidad: Si email es un objeto, NoSQL Injection
    // { email: { $ne: null } } retornaría todos los usuarios
    const user = await User.findOne({ email: email });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: Open Redirect
router.get('/redirect', async (req, res) => {
  try {
    const { url } = req.query;

    // Sin validar destino
    res.redirect(url); // CRÍTICO: Phishing vulnerability
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: Insecure Direct Object Reference (IDOR)
router.delete('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Sin verificar que el usuario tiene permiso
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: Server-Side Template Injection (SSTI)
router.post('/render-template', async (req, res) => {
  try {
    const { template, data } = req.body;
    const ejs = require('ejs');

    // Sin sanitizar template
    const result = ejs.render(template, data);

    res.json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
