// Netlify automatically calls this function on every form submission.
// It sends a booking confirmation email to the customer via Resend.

exports.handler = async (event) => {
  try {
    const { payload } = JSON.parse(event.body);
    const data = payload.data;

    const customerEmail = data.email;
    const firstName     = data['first-name'] || data['firstName'] || data['first_name'] || 'there';
    const tour          = data.tour    || 'your selected tour';
    const date          = data.date    || 'your preferred date';
    const guests        = data.guests  || '—';
    const phone         = data.phone   || '—';
    const notes         = data.notes   || 'None';

    if (!customerEmail) return { statusCode: 200, body: 'No email — skipping' };

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    body { font-family: 'Inter', Arial, sans-serif; background:#f8f5f0; margin:0; padding:0; }
    .wrap { max-width:600px; margin:40px auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,.08); }
    .header { background:#1a6b3c; padding:40px 48px; text-align:center; }
    .header img { width:72px; height:72px; border-radius:50%; object-fit:cover; margin-bottom:16px; }
    .header h1 { font-family:Georgia,serif; color:#fff; font-size:26px; margin:0 0 6px; }
    .header p  { color:rgba(255,255,255,.8); margin:0; font-size:14px; }
    .body { padding:40px 48px; }
    .body h2 { font-family:Georgia,serif; color:#1a1a1a; font-size:22px; margin:0 0 8px; }
    .body p  { color:#4a4a4a; line-height:1.7; margin:0 0 16px; }
    .details { background:#f8f5f0; border-radius:10px; padding:24px; margin:24px 0; }
    .details table { width:100%; border-collapse:collapse; }
    .details td { padding:8px 0; font-size:14px; color:#4a4a4a; border-bottom:1px solid #ede9e3; }
    .details td:first-child { font-weight:600; color:#1a1a1a; width:140px; }
    .details tr:last-child td { border-bottom:none; }
    .cta { text-align:center; margin:32px 0 16px; }
    .cta a { background:#1a6b3c; color:#fff; padding:14px 32px; border-radius:8px; text-decoration:none; font-weight:600; font-size:15px; display:inline-block; }
    .footer { background:#1a1a1a; padding:24px 48px; text-align:center; }
    .footer p { color:rgba(255,255,255,.5); font-size:12px; margin:0; }
    .footer a { color:rgba(255,255,255,.6); text-decoration:none; }
    .badge { display:inline-block; background:#c8973a; color:#fff; border-radius:20px; padding:4px 14px; font-size:12px; font-weight:700; margin-bottom:12px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>North West Scenic Tours</h1>
      <p>Ireland's Premier North West Tour Operator</p>
    </div>
    <div class="body">
      <span class="badge">Booking Request Received</span>
      <h2>Hi ${firstName}, you're all set!</h2>
      <p>Thank you for booking with North West Scenic Tours. We've received your request and our team will confirm your place within <strong>2 hours</strong>.</p>

      <div class="details">
        <table>
          <tr><td>Tour</td><td>${tour}</td></tr>
          <tr><td>Date</td><td>${date}</td></tr>
          <tr><td>Guests</td><td>${guests}</td></tr>
          <tr><td>Phone</td><td>${phone}</td></tr>
          <tr><td>Special Requests</td><td>${notes}</td></tr>
        </table>
      </div>

      <p>If you don't hear from us within 2 hours, please don't hesitate to get in touch:</p>
      <p>
        📞 <strong>+353 74 912 3456</strong><br/>
        ✉ <a href="mailto:hello@northwestscenictours.ie">hello@northwestscenictours.ie</a>
      </p>
      <p style="color:#8a8a8a; font-size:13px;">Free cancellation is available up to 48 hours before your departure date.</p>

      <div class="cta">
        <a href="https://northwestscenictours.ie">Visit Our Website</a>
      </div>
    </div>
    <div class="footer">
      <p>North West Scenic Tours Ltd &nbsp;·&nbsp; Letterkenny, Co. Donegal, Ireland<br/>
      <a href="https://northwestscenictours.ie">northwestscenictours.ie</a></p>
    </div>
  </div>
</body>
</html>`;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:    'North West Scenic Tours <onboarding@resend.dev>',
        to:      [customerEmail],
        subject: `Booking Confirmed — ${tour}`,
        html:    html,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Resend error:', err);
      return { statusCode: 500, body: 'Email failed' };
    }

    return { statusCode: 200, body: 'Confirmation sent' };

  } catch (err) {
    console.error('Function error:', err);
    return { statusCode: 500, body: err.message };
  }
};
