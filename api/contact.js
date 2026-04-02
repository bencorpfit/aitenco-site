const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS: restrict to own domain
  const origin = req.headers.origin;
  if (origin && origin !== 'https://aitenco.com') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { firstName, lastName, email, company, industry, challenge, website } = req.body;

  // Honeypot: if 'website' field is filled, it's a bot
  if (website) {
    return res.status(200).json({ ok: true });
  }

  if (!firstName || !email) {
    return res.status(400).json({ error: 'First name and email are required' });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Sanitize inputs
  const clean = (str) => (str || '').slice(0, 500).trim();

  const PORTAL_ID = process.env.HUBSPOT_PORTAL_ID;
  const FORM_GUID = process.env.HUBSPOT_FORM_GUID;

  if (!PORTAL_ID || !FORM_GUID) {
    // CRM not configured yet - return success but don't log PII
    console.log('Contact form submission received (CRM not configured)');
    return res.status(200).json({ ok: true, fallback: true });
  }

  try {
    const response = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_GUID}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: [
            { name: 'firstname', value: clean(firstName) },
            { name: 'lastname', value: clean(lastName) },
            { name: 'email', value: email.trim() },
            { name: 'company', value: clean(company) },
            { name: 'industry', value: clean(industry) },
            { name: 'message', value: clean(challenge) }
          ],
          context: {
            pageUri: 'https://aitenco.com',
            pageName: 'AITENCO Contact Form'
          }
        })
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error('HubSpot submission failed:', response.status);
      return res.status(502).json({ error: 'Failed to submit to CRM' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
