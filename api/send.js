export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, mobile, message } = req.body;

  // Basic validation
  if (!email || !mobile || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // Your EmailJS credentials (from environment variables)
  const serviceId = "service_4atrvrv";
  const templateId = "template_g1jduov";
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;

  if (!publicKey) {
    console.error("EMAILJS_PUBLIC_KEY not set");
    return res.status(500).json({ error: "Server configuration error" });
  }

  const emailjsData = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: { email, mobile, message },
  };

  try {
    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailjsData),
      },
    );

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const errorText = await response.text();
      console.error("EmailJS error:", errorText);
      // Return the actual error to the frontend
      return res.status(500).json({ error: `EmailJS error: ${errorText}` });
    }
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
