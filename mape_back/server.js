const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const mqttClient = mqtt.connect('mqtt://mapa@broker.emqx.io:1883'); 

// Pocetne koordinate, ukoliko mqtt ne posalje nista
let coordinates = [44.7232, 20.5489];

mqttClient.on('connect', () => {
  mqttClient.subscribe('mapa');
});

// Prijem poruke mqtt-a i parsiranje u niz
mqttClient.on('message', (topic, message) => {
    if (topic === 'mapa') {
      const parsedCoordinates = JSON.parse(message.toString());
      const x = parseFloat(parsedCoordinates.x);
      const y = parseFloat(parsedCoordinates.y);
      coordinates = [x, y];
      console.log('Received coordinates:', coordinates);
    }
  });
  

app.get('/coordinates', (req, res) => {
  res.json({ coordinates });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

