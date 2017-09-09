"use strict";
const express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  cmd = require('./config/cmd'),
  mosca = require('mosca'),
  mqttServ = new mosca.Server({}),
  nunjucks = require('nunjucks');
//express config
app.use('/a',express.static('./plublic/assets'));
//mqtt stuff
mqttServ.attachHttpServer(server);

mqttServ.on('clientConnected', (client) => {
  console.log('client connected', client.id);
});


app.get('/',(req,res) => {
  console.log('tadam!');
  res.send('Hello World!');
});
server.listen(3000);
