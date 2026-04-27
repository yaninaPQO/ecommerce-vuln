const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const router = express.Router();

// Vulnerabilidad: Sin autenticación requerida
router.post('/add', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Vulnerabilidad: Sin validar userId
    const cart = await Cart.findOne({ userId: userId });
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Vulnerabilidad: Sin validar cantidad límite
    if (quantity > 999999) {
      // Podría causar overflow o DoS
    }

    if (cart) {
      const existingItem = cart.items.find(item => item.productId === productId);
      
      if (existingItem) {
        existingItem.quantity += quantity; // Sin validación de límite
      } else {
        cart.items.push({
          productId: productId,
          quantity: quantity,
          price: product.price
        });
      }
      
      await cart.save();
    } else {
      const newCart = new Cart({
        userId: userId,
        items: [{
          productId: productId,
          quantity: quantity,
          price: product.price
        }],
        total: product.price * quantity
      });
      await newCart.save();
    }

    res.json({ message: 'Producto añadido al carrito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: Información sensible expuesta
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Sin verificar si userId es el usuario actual
    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Expone detalles del carrito de cualquier usuario
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: Manipulación de precios
router.put('/update-price', async (req, res) => {
  try {
    const { cartId, itemId, newPrice } = req.body;

    // Sin validar que el precio es legítimo
    const cart = await Cart.findById(cartId);
    const item = cart.items.find(i => i._id.toString() === itemId);

    if (item) {
      item.price = newPrice; // CRÍTICO: Cliente puede cambiar precios
      await cart.save();
    }

    res.json({ message: 'Precio actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: Race Condition en checkout
router.post('/checkout', async (req, res) => {
  try {
    const { userId, cartId } = req.body;

    // Sin transaction - posible race condition
    const cart = await Cart.findById(cartId);

    // Verificar stock (vulnerabilidad: sin lock)
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      
      if (product.stock < item.quantity) {
        // Pero otro proceso podría haber reducido stock primero
        return res.status(400).json({ error: 'Stock insuficiente' });
      }

      // Reducir stock sin atomicidad
      product.stock -= item.quantity;
      await product.save();
    }

    // Vaciar carrito
    cart.items = [];
    await cart.save();

    res.json({ message: 'Orden creada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: CSRF sin protección
router.post('/clear', async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Sin token CSRF
    await Cart.findOneAndUpdate({ userId: userId }, { items: [] });
    
    res.json({ message: 'Carrito vaciado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
