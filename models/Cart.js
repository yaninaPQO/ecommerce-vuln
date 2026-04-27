const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: false // Vulnerabilidad: Debería ser índice único
  },
  items: [{
    productId: String,
    quantity: Number,
    price: Number // Vulnerabilidad: Precio puede cambiar
  }],
  total: Number,
  discount: Number,
  discountCode: String, // Sin validación
  shippingAddress: String, // Puede ser modificado por cliente
  shippingCost: Number,
  // Vulnerabilidad: Información de pago en carrito
  paymentMethod: String,
  cardToken: String,
  billingAddress: String,
  notes: String,
  couponCode: String, // Sin validación de existencia
  promotionalCode: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  expiresAt: Date // Carrito sin expiración en código
});

module.exports = mongoose.model('Cart', cartSchema);
