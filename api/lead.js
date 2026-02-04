// Proxy lead to Hello Moving API (avoids CORS when posting from browser)
// NOTE: This file is a Vercel serverless function (Node.js, CommonJS).
// It receives form-urlencoded data from the browser and forwards it to Hello Moving.

const HELLO_MOVING_URL =
  'https://lead.hellomoving.com/LEADSGWHTTP.lidgw?&API_ID=2F795AB570B1&MOVERREF=said@perfectlyfastmoving.com';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body;

    // Vercel may give us a raw string body or an already-parsed object.
    if (typeof req.body === 'string') {
      body = req.body;
    } else if (req.body && typeof req.body === 'object') {
      body = new URLSearchParams(req.body).toString();
    } else {
      return res.status(400).send('400,Bad request,Missing body');
    }

    const response = await fetch(HELLO_MOVING_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const text = await response.text();
    res.setHeader('Content-Type', 'text/plain');
    return res.status(response.ok ? 200 : 502).send(text);
  } catch (err) {
    console.error('Lead proxy error:', err);
    return res
      .status(500)
      .send('500,Proxy error,' + (err && err.message ? err.message : 'Unknown error'));
  }
};

