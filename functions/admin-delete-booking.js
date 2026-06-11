const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

exports.handler = async (event) => {
  if (!isAuthorized(event)) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { id } = JSON.parse(event.body);
  if (!id) return { statusCode: 400, body: JSON.stringify({ error: 'Missing id' }) };

  try {
    await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Bookings/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` }
    });
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

function isAuthorized(event) {
  const auth = event.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  return token === process.env.ADMIN_SESSION_TOKEN;
}
