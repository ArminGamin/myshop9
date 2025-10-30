import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(secretKey || "");

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!secretKey) {
    res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY' });
    return;
  }

  const {
    amount, // in cents
    name,
    surname,
    email,
    phone,
    address,
    items,
    orderId,
    successUrl,
    cancelUrl,
  } = req.body || {};

  if (!amount || typeof amount !== 'number') {
    res.status(400).json({ error: 'Invalid amount' });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: items?.split('\n')[0] || 'Užsakymas' },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl || `${req.headers.origin || 'https://kaledukampelis.com'}/?status=paid`,
      cancel_url: cancelUrl || `${req.headers.origin || 'https://kaledukampelis.com'}/?status=cancelled`,
      customer_email: email,
      phone_number_collection: { enabled: true },
      shipping_address_collection: { allowed_countries: ['LT', 'LV', 'EE'] },
      payment_intent_data: {
        metadata: {
          name: name || '',
          surname: surname || '',
          email: email || '',
          phone: phone || '',
          address: address || '',
          items: items || '',
          order_id: orderId || '',
        },
      },
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (err) {
    console.error('Create Checkout Session error:', err);
    const message = (err && err.message) ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}


