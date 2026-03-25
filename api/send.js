export default async function handler(req, res) {
  console.log('Request received', req.method, req.body);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, mobile, message } = req.body;

  if (!email || !mobile || !message) {
    console.log('Validation failed: missing fields');
    return res.status(400).json({ error: 'Missing fields' });
  }

  const serviceId = 'service_4atrvrv';
  const templateId = 'template_g1jduov';
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;

  console.log('EmailJS key exists?', !!publicKey);
  console.log('Service ID:', serviceId, 'Template ID:', templateId);

  if (!publicKey) {
    console.error('EMAILJS_PUBLIC_KEY not set in environment');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const emailjsData = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: { email, mobile, message },
  };

  try {
    console.log('Sending to EmailJS...');
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailjsData),
    });

    console.log('EmailJS response status:', response.status);
    if (response.ok) {
      console.log('Email sent successfully');
      res.status(200).json({ success: true });
    } else {
      const errorText = await response.text();
      console.error('EmailJS error:', errorText);
      res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}