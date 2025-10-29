import type { VercelRequest, VercelResponse } from '@vercel/node';

// Sends an order notification to Discord via webhook.
// Set DISCORD_WEBHOOK_URL in your environment. Falls back to a hardcoded URL if provided.
const FALLBACK_WEBHOOK = 'https://discord.com/api/webhooks/1433188852193038496/67gjMdvWLEMqpEK5_U1e_pI2T9HV30mGhvQi0hJgENpueSikdfUzwtKqvu29BSU1wydW';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL || FALLBACK_WEBHOOK;
    const {
      orderNumber,
      total,
      items,
      customer
    } = req.body || {};

    if (!orderNumber || !total || !customer || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const fields = [
      { name: 'Užsakymo numeris', value: String(orderNumber), inline: true },
      { name: 'Suma', value: `€${total}`, inline: true },
      { name: '\u200B', value: '\u200B', inline: false },
      { name: 'Vardas', value: customer.name || '-', inline: true },
      { name: 'Pavardė', value: customer.surname || '-', inline: true },
      { name: 'El. paštas', value: customer.email || '-', inline: false },
      { name: 'Telefonas', value: customer.phone || '-', inline: false },
      { name: 'Adresas', value: `${customer.address || '-'}, ${customer.city || ''} ${customer.postalCode || ''}`, inline: false }
    ];

    const itemsText = items
      .map((it: any) => `• ${it.name} × ${it.quantity} — €${(it.price * it.quantity).toFixed(2)}`)
      .join('\n');

    const embed = {
      title: 'Naujas užsakymas (Apmokėta)',
      color: 0x2ecc71,
      timestamp: new Date().toISOString(),
      fields: [
        ...fields,
        { name: 'Prekės', value: itemsText || '-', inline: false }
      ]
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to notify' });
  }
}


