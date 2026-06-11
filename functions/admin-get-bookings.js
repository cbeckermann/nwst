const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

exports.handler = async (event) => {
  if (!isAuthorized(event)) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Bookings?sort[0][field]=Date&sort[0][direction]=asc`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` }
    });
    const data = await res.json();

    const bookings = (data.records || []).map(r => ({
      id: r.id,
      date: r.fields.Date || '',
      name: r.fields.Name || '',
      email: r.fields.Email || '',
      phone: r.fields.Phone || '',
      guests: r.fields.Guests || 0,
      pickup: r.fields.Pickup || '',
      notes: r.fields.Notes || '',
      status: r.fields.Status || 'Pending'
    }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookings })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

function isAuthorized(event) {
  const auth = event.headers.authorization || '';
  return auth.startsWith('Bearer ') && auth.length > 10;
}
