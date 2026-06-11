const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const MAX_GUESTS = 18;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { date, name, email, phone, guests, pickup, notes, tour } = body;
  if (!date || !name || !email || !guests) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
  }

  const guestCount = parseInt(guests);
  const formattedDate = new Date(date + 'T12:00:00').toLocaleDateString('en-IE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  try {
    // Check availability
    const formula = encodeURIComponent(`{Date}="${date}"`);
    const checkUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Bookings?filterByFormula=${formula}&fields[]=Guests`;
    const checkRes = await fetch(checkUrl, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` }
    });
    const checkData = await checkRes.json();
    const booked = (checkData.records || []).reduce((sum, r) => sum + (r.fields.Guests || 0), 0);

    if (booked + guestCount > MAX_GUESTS) {
      const available = MAX_GUESTS - booked;
      return {
        statusCode: 409,
        body: JSON.stringify({
          error: 'Not enough spots',
          available,
          message: available <= 0
            ? `Sorry, this date is fully booked (${MAX_GUESTS}/${MAX_GUESTS} guests).`
            : `Only ${available} spot${available === 1 ? '' : 's'} left on this date.`
        })
      };
    }

    // Save to Airtable
    const createRes = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Bookings`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: [{
          fields: {
            Date: date,
            Name: name,
            Email: email,
            Phone: phone || '',
            Guests: guestCount,
            Pickup: pickup || '',
            Notes: notes || '',
            Status: 'Pending'
          }
        }]
      })
    });

    const createData = await createRes.json();
    if (createData.error) throw new Error(createData.error.message);

    // Send emails via Resend
    await Promise.all([
      sendCustomerEmail({ name, email, date: formattedDate, guests: guestCount, pickup, tour }),
      sendAdminEmail({ name, email, phone, date: formattedDate, guests: guestCount, pickup, notes, tour })
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, remaining: MAX_GUESTS - booked - guestCount })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

async function sendCustomerEmail({ name, email, date, guests, pickup, tour }) {
  const firstName = name.split(' ')[0];
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'North West Scenic Tours <bookings@northwestscenictours.com>',
      to: email,
      subject: `Booking Request Received — ${tour || 'Wild Atlantic Way'} on ${date}`,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
          <div style="background:#1a6b3c;padding:32px;text-align:center;border-radius:12px 12px 0 0">
            <img src="https://northwestscenictours.com/images/figma-logo.png" alt="Logo" style="width:60px;height:60px;border-radius:50%;margin-bottom:12px" />
            <h1 style="color:white;font-size:1.4rem;margin:0">North West Scenic Tours</h1>
          </div>
          <div style="background:white;padding:40px;border:1px solid #eee;border-radius:0 0 12px 12px">
            <h2 style="color:#1a6b3c;margin-top:0">Hi ${firstName}, we've received your booking!</h2>
            <p style="color:#555;line-height:1.7">Thank you for choosing North West Scenic Tours. Your booking request has been received and we'll confirm your place within <strong>2 hours</strong>.</p>

            <div style="background:#f8f4ef;border-radius:10px;padding:24px;margin:24px 0">
              <h3 style="margin:0 0 16px;font-size:1rem;color:#1a1a1a">Booking Summary</h3>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:6px 0;color:#999;font-size:.88rem;width:40%">Tour</td><td style="padding:6px 0;font-weight:600;font-size:.88rem">${tour || 'Wild Atlantic Way'}</td></tr>
                <tr><td style="padding:6px 0;color:#999;font-size:.88rem">Date</td><td style="padding:6px 0;font-weight:600;font-size:.88rem">${date}</td></tr>
                <tr><td style="padding:6px 0;color:#999;font-size:.88rem">Guests</td><td style="padding:6px 0;font-weight:600;font-size:.88rem">${guests} ${guests === 1 ? 'person' : 'people'}</td></tr>
                ${pickup ? `<tr><td style="padding:6px 0;color:#999;font-size:.88rem">Pick-up</td><td style="padding:6px 0;font-weight:600;font-size:.88rem">${pickup}</td></tr>` : ''}
              </table>
            </div>

            <p style="color:#555;line-height:1.7">If you have any questions in the meantime, scan the QR code below to message Sharon directly on WhatsApp.</p>
            <p style="color:#555;line-height:1.7">We look forward to showing you the best of Ireland's north-west!</p>
            <p style="color:#555">Warm regards,<br/><strong>Sharon &amp; the North West Scenic Tours team</strong></p>
          </div>
          <p style="text-align:center;color:#bbb;font-size:.75rem;margin-top:16px">© 2026 North West Scenic Tours Ltd. Letterkenny, Co. Donegal, Ireland.</p>
        </div>
      `
    })
  });
}

async function sendAdminEmail({ name, email, phone, date, guests, pickup, notes, tour }) {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'NWST Bookings <bookings@northwestscenictours.com>',
      to: 'northwestscenictours@gmail.com',
      subject: `New Booking — ${name} (${guests} guests) on ${date}`,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
          <div style="background:#1a1a1a;padding:24px;border-radius:12px 12px 0 0">
            <h2 style="color:white;margin:0;font-size:1.1rem">New Booking Request</h2>
          </div>
          <div style="background:white;padding:32px;border:1px solid #eee;border-radius:0 0 12px 12px">
            <div style="background:#f8f4ef;border-radius:10px;padding:24px;margin-bottom:16px">
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:6px 0;color:#999;font-size:.88rem;width:35%">Name</td><td style="padding:6px 0;font-weight:600;font-size:.88rem">${name}</td></tr>
                <tr><td style="padding:6px 0;color:#999;font-size:.88rem">Email</td><td style="padding:6px 0;font-size:.88rem"><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding:6px 0;color:#999;font-size:.88rem">Phone</td><td style="padding:6px 0;font-size:.88rem">${phone || '—'}</td></tr>
                <tr><td style="padding:6px 0;color:#999;font-size:.88rem">Tour</td><td style="padding:6px 0;font-weight:600;font-size:.88rem">${tour || 'Wild Atlantic Way'}</td></tr>
                <tr><td style="padding:6px 0;color:#999;font-size:.88rem">Date</td><td style="padding:6px 0;font-weight:600;font-size:.88rem">${date}</td></tr>
                <tr><td style="padding:6px 0;color:#999;font-size:.88rem">Guests</td><td style="padding:6px 0;font-weight:600;font-size:.88rem">${guests}</td></tr>
                <tr><td style="padding:6px 0;color:#999;font-size:.88rem">Pick-up</td><td style="padding:6px 0;font-size:.88rem">${pickup || '—'}</td></tr>
                ${notes ? `<tr><td style="padding:6px 0;color:#999;font-size:.88rem">Notes</td><td style="padding:6px 0;font-size:.88rem">${notes}</td></tr>` : ''}
              </table>
            </div>
            <a href="https://northwestscenictours.com/admin" style="display:inline-block;background:#1a6b3c;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:.9rem">View in Admin Portal</a>
          </div>
        </div>
      `
    })
  });
}
