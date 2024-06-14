const express = require('express');
const axios = require('axios');
const router = express.Router();

const CHAPA_PUBLIC_KEY = process.env.CHAPA_PUBLIC_KEY;
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
const CHAPA_URL = 'https://api.chapa.co/v1/transaction/initialize';

// Initialize payment
router.post('/initialize', async (req, res) => {
  const { amount, email, firstName, lastName } = req.body;

  console.log('Received payment initialization request:', { amount, email, firstName, lastName });
  console.log('Using public key:', CHAPA_PUBLIC_KEY);

  try {
    const response = await axios.post(
      CHAPA_URL,
      {
        amount,
        currency: 'ETB',
        email,
        first_name: firstName,
        last_name: lastName,
        tx_ref: `tx-${Date.now()}`, // Unique transaction reference
        callback_url: 'http://localhost:3001/api/payment/callback', // Update this with your actual callback URL
      },
      {
        headers: {
          Authorization: `Bearer ${CHAPA_PUBLIC_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Payment initialization response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error initializing payment:', error.response?.data || error.message, error.stack);
    res.status(500).json({ error: 'Failed to initialize payment', details: error.response?.data || error.message });
  }
});

// Payment callback
router.post('/callback', async (req, res) => {
  const { tx_ref } = req.body;

  console.log('Received payment callback with tx_ref:', tx_ref);

  try {
    const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
      },
    });

    console.log('Payment verification response:', response.data);

    if (response.data.status === 'success') {
      // Payment was successful, update your database
      const amount = response.data.data.amount;
      // Update order status or perform other actions
      res.json({ success: true, amount });
    } else {
      res.status(400).json({ error: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error.response?.data || error.message, error.stack);
    res.status(500).json({ error: 'Failed to verify payment', details: error.response?.data || error.message });
  }
});

module.exports = router;
