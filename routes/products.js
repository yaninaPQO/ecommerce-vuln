const express = require('express');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const Product = require('../models/Product');
const router = express.Router();

// Vulnerabilidad: Configuración insegura de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directorio predecible
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Usa nombre original sin sanitizar
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB sin restricción real
  fileFilter: (req, file, cb) => {
    // Vulnerabilidad: Validación débil de extensión
    const allowedExtensions = ['.jpg', '.png', '.pdf', '.exe', '.sh'];
    if (allowedExtensions.includes(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

// Vulnerabilidad: Sin autenticación requerida
router.get('/top-sellers', async (req, res) => {
  try {
    // Vulnerabilidad: Query sin prepared statements (usando string concatenation)
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    
    // Simulación de SQL Injection
    const query = { status: 'active' };
    const products = await Product.find(query)
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: Path Traversal
router.get('/image/:imageName', (req, res) => {
  const { imageName } = req.params;
  
  // Vulnerabilidad CRÍTICA: Path Traversal - permite acceder a archivos del sistema
  const imagePath = path.join(__dirname, '../uploads/', imageName);
  
  res.sendFile(imagePath);
});

// Vulnerabilidad: Command Injection
router.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    
    // Vulnerabilidad: Sin sanitización de entrada
    const searchQuery = `db.products.find({$where: "this.name.includes('${query}')"})`;
    
    const products = await Product.find({ 
      $where: `this.name.includes('${query}')`
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: Race Condition
router.post('/create', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, sku } = req.body;

    // Vulnerabilidad: Sin verificar unicidad antes de crear
    const existingProduct = await Product.findOne({ sku: sku });
    
    // Sin yield/await adecuado (race condition)
    if (!existingProduct) {
      const product = new Product({
        name: name,
        price: parseFloat(price),
        description: description,
        sku: sku,
        imageUrl: req.file ? req.file.path : null,
        createdBy: req.body.userId, // Sin validación
        createdAt: new Date()
      });

      await product.save();
      res.status(201).json(product);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: SSRF (Server-Side Request Forgery)
router.post('/import-from-url', async (req, res) => {
  try {
    const { url } = req.body;
    
    // Vulnerabilidad CRÍTICA: SSRF - Sin validar URL
    const response = await axios.get(url, {
      timeout: 5000
    });

    // Asume que la respuesta es JSON con productos
    const products = response.data.products;
    
    // Importa sin validación
    for (const product of products) {
      const newProduct = new Product(product);
      await newProduct.save();
    }

    res.json({ message: 'Productos importados', count: products.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: Information Disclosure
router.get('/:id/full-details', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    // Retorna información sensible sin necesidad
    res.json({
      ...product.toObject(),
      costPrice: product.costPrice, // No debería estar disponible
      supplierId: product.supplierId, // Información interna
      internalNotes: product.internalNotes, // Notas internas
      warehouseLocation: product.warehouseLocation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: Missing Function Level Access Control
router.delete('/:id', async (req, res) => {
  try {
    // Sin verificar si el usuario es administrador
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
