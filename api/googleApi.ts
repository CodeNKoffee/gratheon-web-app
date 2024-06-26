const { google } = require('googleapis');

// Load client secrets from a local file.
const fs = require('fs');
const path = require('path');
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = path.join(__dirname, 'token.json');

const authenticate = () => {
  // Load client secrets from a local file.
  const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  if (fs.existsSync(TOKEN_PATH)) {
    const token = fs.readFileSync(TOKEN_PATH, 'utf8');
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  } else {
    getAccessToken(oAuth2Client);
  }
};

const getAccessToken = (oAuth2Client) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  // Redirect user to the authUrl and get the code from the query string, then call:
  // oAuth2Client.getToken(code, (err, token) => { if (err) return console.error('Error retrieving access token', err); oAuth2Client.setCredentials(token); fs.writeFileSync(TOKEN_PATH, JSON.stringify(token)); });
};

module.exports = {
  authenticate,
};