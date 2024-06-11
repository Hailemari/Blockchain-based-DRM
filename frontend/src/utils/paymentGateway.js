import Flutterwave from 'flutterwave-node-v3';

const flw = new Flutterwave(process.env.FLUTTERWAVE_PUBLIC_KEY, process.env.FLUTTERWAVE_SECRET_KEY);

export const processPayment = async (amount, currency, customerEmail) => {
  try {
    const response = await flw.Transaction.initiate({
      tx_ref: `hooli-tx-${Date.now()}`,
      amount,
      currency,
      redirect_url: "https://your-site.com/callback",
      payment_options: "card",
      customer: {
        email: customerEmail,
      },
      customizations: {
        title: "Content Purchase",
        description: "Payment for content",
      },
    });
    return response;
  } catch (error) {
    console.error('Payment initiation error:', error);
    throw error;
  }
};
