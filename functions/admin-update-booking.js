const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

exports.handler = async (event) => {
  if (!isAuthorized(event)) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { id, status } = JSON.parse(event.body);
  if (!id || !status) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing id or status' }) };
  }

  try {
    const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Bookings/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields: { Status: status } })
    });
    const data = await res.json();
    return { statusCode: 200, body: JSON.stringify({ success: true, id: data.id }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

function isAuthorized(event) {
  const auth = event.headers.authorization || '';
  return auth.startsWith('Bearer ') && auth.length > 10;
}
