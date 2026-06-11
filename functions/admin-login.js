exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { username, password } = JSON.parse(event.body || '{}');

  const validUser = process.env.ADMIN_USERNAME;
  const validPass = process.env.ADMIN_PASSWORD;
  const sessionToken = process.env.ADMIN_SESSION_TOKEN;

  if (!validUser || !validPass || !sessionToken) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server misconfigured' }) };
  }

  if (username === validUser && password === validPass) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, token: sessionToken })
    };
  }

  return {
    statusCode: 401,
    body: JSON.stringify({ error: 'Invalid username or password' })
  };
};
