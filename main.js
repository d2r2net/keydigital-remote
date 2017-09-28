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
    cache: false,
    express: app
});

//express config
app.use('/a', express.static('public/assets'));

//mqtt stuff
mqttServ.attachHttpServer(server);

mqttServ.on('clientConnected', (client) => {
  console.log('client connected', client.id);
});

// web server
app.get('/',(req,res) => {
  console.log('tadam!');
  var data = {bonjour:'allo',
  serveur:cmd.serveur.url,
  inputs:cmd.inputs,
  outputs:cmd.outputs};


  res.render('index.html',data);
  console.log(data.serveur);

});
server.listen(3000);
