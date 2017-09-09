"use strict";
const express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  cmd = require('./config/cmd'),
  mosca = require('mosca'),
  mqttServ = new mosca.Server({}),
  nunjucks = require('nunjucks');

//nunjucks config
  nunjucks.configure('views', {
  autoescape: true,
  noCache: true,
  express   : app
});

//express config
app.use('/a', express.static('public/assets'));
//mqtt stuff
mqttServ.attachHttpServer(server);

mqttServ.on('clientConnected', (client) => {
  console.log('client connected', client.id);
});


app.get('/',(req,res) => {
  console.log('tadam!');
  res.render('index.njk');
});
server.listen(3000);
