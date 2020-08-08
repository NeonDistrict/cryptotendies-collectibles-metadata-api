// Core Modules
const express = require('express');
const server  = express();

// Config
const PORT = process.env.PORT || 5000;

// Routes
const api = require('./src/api.js');

// Endpoints
server.get('/', function(req, res) {
  res.send('No information provided here - CryptoTendies Metadata API.');
})

server.get('/api/card/:id', api.getCard);

server.get('/api/box/:id', api.getBox);

server.listen(PORT, function() {
  console.log('Node server is running on port', PORT);
});
