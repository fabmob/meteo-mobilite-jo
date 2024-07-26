// Simple server required to handle react routing alongside static files
const express = require('express');
const server = express();

server.use('/data', express.static('data'));
server.use('/components', express.static('components'));
server.use('/images', express.static('images'));

server.get('/index.js', (_, res) => {
  res.sendFile(__dirname + '/index.js');
});
server.get('/main.css', (_, res) => {
  res.sendFile(__dirname + '/main.css');
});
server.get('*', (_, res) => {
  res.sendFile(__dirname + '/index.html');
});

const port = 8000;
server.listen(port, () => {
  console.log('Server listening on port', port);
});
