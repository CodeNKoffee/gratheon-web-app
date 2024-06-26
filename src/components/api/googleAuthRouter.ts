const express = require('express');
const { authenticate, setToken, removeToken } = require('./googleApi');
const app = express();

app.get('/api/auth', (req, res) => {
  const authResult = authenticate();
  if (typeof authResult === 'string') {
    res.json({ authUrl: authResult });
  } else {
    res.json({ message: 'Already authorized' });
  }
});

app.get('/api/callback', (req, res) => {
  const { code } = req.query;
  const oAuth2Client = authenticate();

  oAuth2Client.getToken(code, (err, token) => {
    if (err) return res.status(400).json({ error: 'Error retrieving access token' });
    oAuth2Client.setCredentials(token);
    setToken(token); // Corrected from storeToken to setToken
    res.json({ message: 'Authorization successful' });
  });
});

app.post('/api/disconnect', (req, res) => {
  removeToken();
  res.json({ message: 'Disconnected successfully' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});