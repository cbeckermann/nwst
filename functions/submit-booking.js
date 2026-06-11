const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
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

  const { date, name, email, phone, guests, pickup, notes } = body;
  if (!date || !name || !email || !guests) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
  }

  const guestCount = parseInt(guests);

  try {
    // Check current availability
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

    // Create the booking
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

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, remaining: MAX_GUESTS - booked - guestCount })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
