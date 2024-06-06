const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

require('dotenv').config();
const apiKey = process.env.API_KEY;

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api-key', (req, res) => {
  res.json({ key: process.env.API_KEY });
});

app.post('/submit', async (req, res) => {
  const { latitude, longitude } = req.body;
  console.log(`Latitude: ${latitude}, Longitude: ${longitude}`); // Log the values to check them

  try {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=tourist_attraction&rankby=prominence&key=${apiKey}`;
    
    console.log(`Making request to: ${apiUrl}`); // Log the URL to check it

    const response = await axios.get(apiUrl);
    const places = response.data.results;

    if (response.data.status !== 'OK') {
      console.error('Error from API:', response.data);
      return res.status(500).send('Error from API');
    }

    res.render('results', { places, apiKey }); // Pass apiKey for image rendering
  } catch (error) {
    console.error('Error making API request:', error);
    res.status(500).send('Error sending data to API');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
