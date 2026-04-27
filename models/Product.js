const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  costPrice: Number, // Información que no debería estar disponible públicamente
  sku: {
    type: String,
    unique: false // Vulnerabilidad: debería ser única
  },
  stock: {
    type: Number,
    default: 0
  },
  imageUrl: String,
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active'
  },
  // Vulnerabilidad: Datos internos en el modelo
  warehouseLocation: String,
  supplierId: String,
  internalNotes: String,
  costMargin: Number,
  profitMargin: Number,
  
  // Vulnerabilidad: Información de auditoría visible
  createdBy: String,
  editedBy: String,
  deletedBy: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  deletedAt: Date,
  
  // Vulnerabilidad: Estados sin validación
  hidden: Boolean,
  featured: Boolean,
  discounted: Boolean,
  discountPercent: Number
});

module.exports = mongoose.model('Product', productSchema);
