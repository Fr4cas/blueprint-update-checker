require('dotenv').config();
const { exchangeAuthCodeForToken } = require('../auth');

const code = 'us_f92bb56b8bbf4604b4f4239f9e5c8394'; 

exchangeAuthCodeForToken(code)
  .then(data => {
    console.log('Access token:', data.access_token);
    console.log('Refresh token:', data.refresh_token);
  })
  .catch(err => console.error('Failed to exchange code:', err.message));