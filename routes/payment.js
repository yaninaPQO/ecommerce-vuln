const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_KEY || 'sk_test_insecure_key_12345');
const axios = require('axios');
const router = express.Router();

// Vulnerabilidad: Stripe key hardcodeada/visible
const STRIPE_SECRET = 'sk_test_4eC39HqLyjWDarhtT657j8AqHrY';

// Vulnerabilidad: Sin validación de montos
router.post('/process', async (req, res) => {
  try {
    const { amount, cardToken, userId } = req.body;

    // Vulnerabilidad: Sin validar monto (podría ser 0 o negativo)
    if (amount <= 0) {
      // Debería rechazar pero no lo hace correctamente
    }

    // Vulnerabilidad: Usa token de tarjeta inseguro directamente
    const charge = await stripe.charges.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      source: cardToken,
      description: `Pago de ${userId}`
    });

    res.json({
      success: true,
      chargeId: charge.id,
      // Vulnerabilidad: Expone información de pago
      cardLastFour: cardToken.last4,
      fullResponse: charge
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: Log de información sensible
router.post('/payment-log', async (req, res) => {
  try {
    const { cardNumber, cvv, amount } = req.body;

    // CRÍTICO: Loguea datos sensibles
    console.log(`Pago procesado: Tarjeta=${cardNumber}, CVV=${cvv}, Monto=${amount}`);
    
    // También se podría guardar en base de datos sin encripción
    fs.appendFileSync('./payment_log.txt', 
      `${new Date()}: Card=${cardNumber}, CVV=${cvv}, Amount=${amount}\n`
    );

    res.json({ message: 'Pago registrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: Verificación de pago insegura
router.post('/verify-payment', async (req, res) => {
  try {
    const { chargeId } = req.body;

    // Sin verificar que chargeId es válido
    const charge = await stripe.charges.retrieve(chargeId);

    // Asume que si existe, es válido
    if (charge) {
      res.json({ 
        verified: true, 
        charge: charge,
        // Expone detalles completos del cargo
        cardDetails: charge.source
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: Webhook sin verificación
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  try {
    const event = JSON.parse(req.body);

    // CRÍTICO: Sin verificar firma del webhook
    // Cualquiera puede enviar eventos fake
    
    if (event.type === 'charge.succeeded') {
      // Procesa el pago sin validación
      updateOrderStatus(event.data.object.metadata.orderId, 'paid');
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Vulnerabilidad: PayPal integration insegura
router.post('/paypal-payment', async (req, res) => {
  try {
    const { amount, returnUrl } = req.body;

    // Vulnerabilidad: Usa credenciales hardcodeadas
    const paypalAuth = {
      username: 'insecure_api.merchant.com',
      password: 'WXYZ1234567890ABCDEF'
    };

    // Vulnerabilidad: Sin validar returnUrl
    const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${paypalAuth.username}&item_number=1&item_name=Order&amount=${amount}&return=${returnUrl}`;

    // Expone credenciales en URL
    console.log('PayPal URL:', paypalUrl);

    res.json({ redirectUrl: paypalUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: Acceso a órdenes de otros usuarios
router.get('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    // Sin verificar que el usuario es propietario de la orden
    const order = await Order.findById(orderId);

    res.json({
      orderId: order._id,
      userId: order.userId,
      items: order.items,
      paymentMethod: order.paymentMethod,
      // Expone información de pago sensible
      paymentDetails: order.paymentDetails,
      cardToken: order.cardToken
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vulnerabilidad: Refund manipulation
router.post('/refund', async (req, res) => {
  try {
    const { chargeId, amount } = req.body;

    // Sin verificar si el usuario tiene permiso de refund
    const refund = await stripe.refunds.create({
      charge: chargeId,
      amount: Math.round(amount * 100) // Cliente puede especificar cualquier monto
    });

    res.json({ refundId: refund.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
