import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    console.log('Submitting payment:', { amount, email, firstName, lastName });

    try {
      const response = await axios.post('http://localhost:3001/api/payment/initialize', {
        amount,
        email,
        firstName,
        lastName,
      });

      console.log('Payment initialization response:', response.data);

      if (response.data.status === 'success') {
        window.location.href = response.data.data.checkout_url;
      } else {
        setError('Payment initialization failed.');
        console.error('Payment initialization failed:', response.data);
      }
    } catch (error) {
      setError('Error initializing payment. Please try again.');
      console.error('Error initializing payment:', error.response?.data || error.message, error.stack);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <h2>Chapa Payment Integration</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <form onSubmit={handlePayment}>
        <div>
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Pay with Chapa'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
