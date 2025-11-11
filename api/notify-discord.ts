// Sends a formatted order notification to Discord via webhook.
const FALLBACK_WEBHOOK =
  'https://discord.com/api/webhooks/1433188852193038496/67gjMdvWLEMqpEK5_U1e_pI2T9HV30mGhvQi0hJgENpueSikdfUzwtKqvu29BSU1wydW';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL || FALLBACK_WEBHOOK;

    // This endpoint can be called by either Stripe or PayPal webhook handler
    const {
      provider, // \"stripe\" or \"paypal\"
      orderNumber,
      total,
      items = [],
      customer = {},
    } = req.body || {};

    if (!total || !customer || typeof customer !== 'object') {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // Define embed color and title depending on provider
    const color = provider === 'paypal' ? 0xf1c40f : 0x2ecc71;
    const title =
      provider === 'paypal'
        ? '🟡 Naujas PayPal užsakymas (Apmokėta)'
        : '💳 Naujas Stripe užsakymas (Apmokėta)';

    // Format main order info
    const fields = [
      ...(orderNumber
        ? [{ name: 'Užsakymo numeris', value: String(orderNumber), inline: true }]
        : []),
      { name: 'Suma', value: `€${total}`, inline: true },
      { name: '\\u200B', value: '\\u200B', inline: false },
      { name: 'Vardas', value: (customer as any).name || '-', inline: true },
      { name: 'Pavardė', value: (customer as any).surname || '-', inline: true },
      { name: 'El. paštas', value: (customer as any).email || '-', inline: false },
      { name: 'Telefonas', value: (customer as any).phone || '-', inline: false },
      {
        name: 'Adresas',
        value: `${(customer as any).address || '-'}, ${(customer as any).city || ''} ${(customer as any).postalCode || ''}`,
        inline: false,
      },
    ];

    // Optional: include product details if available
    const itemsText =
      Array.isArray(items) && items.length
        ? items
            .map(
              (it: any) =>
                `• ${it.name} × ${it.quantity || 1} — €${(
                  Number(it.price) * Number(it.quantity || 1)
                ).toFixed(2)}`
            )
            .join('\\n')
        : '-';

    // Optional: include selected colors if provided
    const colorsText =
      Array.isArray(items) && items.length
        ? items
            .map((it: any) => {
              const color = it.selectedColor || it.color || it.colour;
              return color ? `• ${it.name}: ${color}` : '';
            })
            .filter(Boolean)
            .join('\\n') || '-'
        : '-';

    const embed = {
      title,
      color,
      timestamp: new Date().toISOString(),
      fields: [
        ...fields,
        { name: 'Prekės', value: itemsText, inline: false },
        { name: 'Spalva', value: colorsText, inline: false },
      ],
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Discord notify error:', e);
    return res.status(500).json({ error: 'Failed to notify' });
  }
}


