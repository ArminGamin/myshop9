import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(secretKey || "");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  if (!secretKey) {
    res.status(500).json({ error: "Missing STRIPE_SECRET_KEY" });
    return;
  }

  const { amount, name, surname, email, phone, address, items } = req.body || {};

  if (!amount || typeof amount !== "number") {
    res.status(400).json({ error: "Invalid amount" });
    return;
  }

  try {
    const metadata = {
      name: name || "",
      surname: surname || "",
      email: email || "",
      phone: phone || "",
      address: address || "",
      items: items || ""
    };

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // amount in cents
      currency: "eur",
      metadata
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Create PaymentIntent error:", err);
    const message = (err && err.message) ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}


