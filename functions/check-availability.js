const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const MAX_GUESTS = 14;

exports.handler = async (event) => {
  const date = event.queryStringParameters && event.queryStringParameters.date;
  if (!date) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing date' }) };
  }

  try {
    const formula = encodeURIComponent(`{Date}="${date}"`);
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Bookings?filterByFormula=${formula}&fields[]=Guests`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` }
    });
    const data = await res.json();

    const booked = (data.records || []).reduce((sum, r) => sum + (r.fields.Guests || 0), 0);
    const available = MAX_GUESTS - booked;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, booked, available, full: available <= 0 })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
