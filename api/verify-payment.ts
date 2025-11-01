// Using loose types to avoid requiring '@vercel/node' in this Vite app

// Mock payment verification endpoint.
// In production, verify with your PSP (e.g., Stripe) using their SDK + webhook signature.
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderNumber, amount } = req.body || {};
    if (!orderNumber || !amount) {
      return res.status(400).json({ error: 'Missing orderNumber or amount' });
    }

    // Simple sanity check
    const value = parseFloat(String(amount));
    if (Number.isNaN(value) || value <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Simulate a verification latency
    await new Promise((r) => setTimeout(r, 150));

    return res.status(200).json({ status: 'paid', orderNumber });
  } catch (e) {
    return res.status(500).json({ error: 'Internal error' });
  }
}


