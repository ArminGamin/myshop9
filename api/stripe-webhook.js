import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-11-08" });

export const config = {
  api: {
    bodyParser: false,
  },
};

function buffer(readable) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readable.on("data", (chunk) => chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk));
    readable.on("end", () => resolve(Buffer.concat(chunks)));
    readable.on("error", (err) => reject(err));
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const sig = req.headers["stripe-signature"];
  const rawBody = await buffer(req);
  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const payment = event.data.object;
    const md = payment.metadata || {};

    const orderNumber = md.order_id || `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const amount = (payment.amount / 100).toFixed(2);

    const fields = [
      { name: 'Užsakymo numeris', value: String(orderNumber), inline: true },
      { name: 'Suma', value: `€${amount}`, inline: true },
      { name: '\u200B', value: '\u200B', inline: false },
      { name: 'Vardas', value: md.name || '-', inline: true },
      { name: 'Pavardė', value: md.surname || '-', inline: true },
      { name: 'El. paštas', value: md.email || '-', inline: false },
      { name: 'Telefonas', value: md.phone || '-', inline: false },
      { name: 'Adresas', value: md.address || '-', inline: false },
      { name: 'Prekės', value: md.items || '-', inline: false }
    ];

    const embed = {
      title: 'Naujas užsakymas (Apmokėta)',
      color: 0x2ecc71,
      timestamp: new Date().toISOString(),
      fields
    };

    try {
      await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] })
      });
    } catch (err) {
      console.error("Discord webhook error:", err);
    }
  }

  res.status(200).send("OK");
}


