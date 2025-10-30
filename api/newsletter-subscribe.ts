import type { VercelRequest, VercelResponse } from '@vercel/node';

// Optional Redis (Upstash) for global dedup
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisGet(key: string) {
  if (!REDIS_URL || !REDIS_TOKEN) return null;
  const r = await fetch(`${REDIS_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    cache: 'no-store',
  });
  if (!r.ok) return null;
  const data = await r.json().catch(() => null);
  return data?.result ?? null;
}

async function redisSetNX(key: string, value: string, ttlSeconds: number) {
  if (!REDIS_URL || !REDIS_TOKEN) return false;
  const r = await fetch(`${REDIS_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}?NX=1&EX=${ttlSeconds}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });
  if (!r.ok) return false;
  const data = await r.json().catch(() => null);
  return data?.result === 'OK';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email } = (req.body || {}) as { email?: string };
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    const e = email.trim().toLowerCase();

    // Global dedup with Redis (24h TTL extendable)
    if (REDIS_URL && REDIS_TOKEN) {
      const key = `nl:email:${e}`;
      const exists = await redisGet(key);
      if (exists) {
        return res.status(409).json({ error: 'Šis el. paštas jau užregistruotas.' });
      }
      // Reserve for 24h; ESPs typically dedup permanently, but we can re-extend later
      const ok = await redisSetNX(key, '1', 60 * 60 * 24);
      if (!ok) {
        return res.status(409).json({ error: 'Šis el. paštas jau užregistruotas.' });
      }
    }

    // Send email via Resend (no activation page)
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      return res.status(500).json({ error: 'Missing RESEND_API_KEY' });
    }

    // Use Resend onboarding sender for testing if you haven't verified a domain yet
    const fromAddress = process.env.RESEND_FROM || 'onboarding@resend.dev';
    const emailBody = {
      from: fromAddress,
      to: ['kaleddovanos@gmail.com'],
      subject: 'Naujas naujienlaiškio prenumeratorius',
      text: `Gautas naujas prenumeratos adresas: ${e}`,
    } as const;

    const forward = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailBody),
    });

    if (!forward.ok) {
      const msg = await forward.json().catch(async () => ({ message: await forward.text().catch(() => '') }));
      return res.status(502).json({ error: 'Failed to deliver', details: msg });
    }

    // Notify Discord (newsletter channel)
    try {
      const webhook = process.env.DISCORD_NEWSLETTER_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1433587314684071961/pjDZLwaQJE21dQMkXVivP-dRxLgvx75DrlSbChvOfUTLsJ6V-kuN3KVjaQ1y0EgbmbAO';
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [
            {
              title: 'Naujas naujienlaiškio prenumeratorius',
              color: 0x3498db,
              timestamp: new Date().toISOString(),
              fields: [
                { name: 'El. paštas', value: e, inline: false }
              ]
            }
          ]
        })
      });
    } catch {}

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}


