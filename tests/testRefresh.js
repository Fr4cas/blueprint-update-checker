require('dotenv').config();
const { getAccessTokenFromRefresh } = require('../auth');

getAccessTokenFromRefresh().then(token => {
  console.log('Access token:', token);
}).catch(err => {
  console.error('Failed to refresh:', err.message);
});