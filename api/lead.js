// Proxy lead to Hello Moving API (avoids CORS when posting from browser)
// Also sends lead to GoHighLevel (GHL) when GHL_API_KEY and GHL_LOCATION_ID are set.
// NOTE: This file is a Vercel serverless function (Node.js, CommonJS).

const HELLO_MOVING_URL =
  'https://lead.hellomoving.com/LEADSGWHTTP.lidgw?&API_ID=2F795AB570B1&MOVERREF=said@perfectlyfastmoving.com';

const GHL_CONTACTS_URL = 'https://services.leadconnectorhq.com/contacts/upsert';

/** Parse form body into key-value object */
function parseFormBody(bodyStr) {
  const params = new URLSearchParams(bodyStr);
  const out = {};
  for (const [k, v] of params) {
    out[k] = v;
  }
  return out;
}

/** Send contact to GoHighLevel (fire-and-forget; errors logged only) */
async function sendToGHL(contact) {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) {
    return;
  }

  const payload = {
    locationId,
    firstName: contact.firstname || '',
    lastName: contact.lastname || '',
    email: contact.email || '',
    phone: contact.phone1 || contact.phone || '',
  };

  // Add Ref_no (clickid) to GHL contact
  if (contact.Ref_no) {
    // Add as tag for easy filtering/searching (e.g. "Ref:232323232")
    payload.tags = [`Ref:${contact.Ref_no}`];
    // Use sourceId for tracking/attribution
    payload.sourceId = contact.Ref_no;
    
    // Optional: If you created a custom field "Ref No" or "ClickID" in GHL, 
    // uncomment below and replace 'YOUR_CUSTOM_FIELD_ID' with the actual field ID from GHL
    // payload.customFieldValueList = [{ customFieldId: 'YOUR_CUSTOM_FIELD_ID', fieldValue: contact.Ref_no }];
  }

  try {
    const ghlRes = await fetch(GHL_CONTACTS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        Version: '2021-07-28',
      },
      body: JSON.stringify(payload),
    });
    if (!ghlRes.ok) {
      const errText = await ghlRes.text();
      console.error('GHL upsert failed:', ghlRes.status, errText);
    }
  } catch (err) {
    console.error('GHL request error:', err);
  }
}

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

    // Send to Hello Moving (primary)
    const response = await fetch(HELLO_MOVING_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const text = await response.text();

    // Also send to GoHighLevel (does not block or change response)
    const form = parseFormBody(body);
    sendToGHL(form).catch(() => {});

    res.setHeader('Content-Type', 'text/plain');
    return res.status(response.ok ? 200 : 502).send(text);
  } catch (err) {
    console.error('Lead proxy error:', err);
    return res
      .status(500)
      .send('500,Proxy error,' + (err && err.message ? err.message : 'Unknown error'));
  }
};

