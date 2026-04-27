const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: false
  },
  userId: String,
  items: [{
    productId: String,
    quantity: Number,
    price: Number,
    name: String
  }],
  totalAmount: Number,
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  // Vulnerabilidad: Información de pago en orden
  paymentDetails: {
    method: String,
    cardNumber: String, // CRÍTICO: Nunca almacenar
    cvv: String, // CRÍTICO: Nunca almacenar
    expiryDate: String,
    amount: Number,
    transactionId: String
  },
  cardToken: String, // Sin encriptación
  // Vulnerabilidad: Información de envío completa
  shippingAddress: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  billingAddress: {
    fullName: String,
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  trackingNumber: String,
  shippingCost: Number,
  discount: Number,
  tax: Number,
  // Vulnerabilidad: Notas sin validación
  notes: String,
  internalNotes: String,
  // Información de auditoría
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  processedBy: String,
  ipAddress: String,
  userAgent: String
});

module.exports = mongoose.model('Order', orderSchema);
