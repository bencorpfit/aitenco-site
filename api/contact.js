export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, company, industry, challenge } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ error: 'First name and email are required' });
  }

  // HubSpot form submission
  // Replace PORTAL_ID and FORM_GUID with your HubSpot values
  const PORTAL_ID = process.env.HUBSPOT_PORTAL_ID;
  const FORM_GUID = process.env.HUBSPOT_FORM_GUID;

  if (!PORTAL_ID || !FORM_GUID) {
    // Fallback: send email notification via Resend or log
    console.log('New lead:', { firstName, lastName, email, company, industry, challenge });
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
            { name: 'firstname', value: firstName },
            { name: 'lastname', value: lastName || '' },
            { name: 'email', value: email },
            { name: 'company', value: company || '' },
            { name: 'industry', value: industry || '' },
            { name: 'message', value: challenge || '' }
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
      console.error('HubSpot error:', text);
      return res.status(502).json({ error: 'Failed to submit to CRM' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
