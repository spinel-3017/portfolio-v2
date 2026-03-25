export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, mobile, message } = req.body;

  // Basic validation (you can match what you have in frontend)
  if (!email || !mobile || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // Your EmailJS credentials (these will come from environment variables)
  const serviceId = 'service_4atrvrv';
  const templateId = 'template_g1jduov';
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;

  // Prepare the data for EmailJS API
  const emailjsData = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      email: email,
      mobile: mobile,
      message: message,
    },
  };

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailjsData),
    });

    if (response.ok) {
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