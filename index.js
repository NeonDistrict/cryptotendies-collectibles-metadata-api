// Core Modules
const express = require('express');
const server  = express();
const cors    = require('cors');
const dotenv  = require('dotenv');
dotenv.config();


server.use(cors());

// Config
const PORT = process.env.PORT || 5000;

// Routes
const metadata = require('./src/metadata.js');
const address = require('./src/address.js');
const config = require('./src/config.js');

// Endpoints
server.get('/', function(req, res) {
  res.send('No information provided here - CryptoTendies Metadata API.');
})

// Metadata API
server.get('/api/card/:id', metadata.getCard);

server.get('/api/box/:id', metadata.getBox);

// Configs
server.get('/api/cards/', config.getCards);

server.get('/api/boxes/', config.getBoxes);

server.get('/api/contracts/', config.getContracts);

// User data
server.get('/api/address/:address/:network', address.getAddress);


server.listen(PORT, function() {
  console.log('Node server is running on port', PORT);
});
