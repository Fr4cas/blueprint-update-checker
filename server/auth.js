require('dotenv').config();

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

/* ====== Deprecated: Only used for one time manual code exchange - start ======*/
async function exchangeAuthCodeForToken(code) {

  if (!code) throw new Error('Authorization code missing');

  const response = await fetch('https://id.trimble.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'http://localhost',
      client_id: process.env.TRIMBLE_CLIENT_ID,
      client_secret: process.env.TRIMBLE_CLIENT_SECRET,
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error_description || data.error);
  }

  return data;
}
/* ====== Deprecated: Only used for one time manual code exchange - end ======*/

module.exports = {
  exchangeAuthCodeForToken,
};