"use strict";
const express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  cmd = require('./config/cmd'),
  mqtt = require('mqtt'),
  mosca = require('mosca'),
  mqttServ = new mosca.Server({}),
  nunjucks = require('nunjucks'),
  SerialPort = require('serialport'),
  outputs = cmd.outputs,
  inputs = cmd.inputs;

//nunjucks config
nunjucks.configure('views', {
    autoescape: true,
    cache: false,
    express: app
});

//express config
app.use('/a', express.static('public/assets'));

//mqtt server  stuff
mqttServ.attachHttpServer(server);

mqttServ.on('clientConnected', (client) => {
  console.log('client connected', client.id);
});

// web server
app.get('/',(req,res) => {
  console.log('tadam!');
  var data = {bonjour:'allo',
  serveur:cmd.serveur.url,
  inputs:inputs,
  outputs:outputs};

  res.render('index.html',data);
  console.log(data.serveur);

});
server.listen(3000);
mqttClient();

function mqttClient() {
  var client  = mqtt.connect('ws://127.0.0.1:3000');
   const topics = [];

  Object.keys(cmd.outputs).forEach((key) => {
      var out = outputs[key];


      if (out.active === true){

      const outTopic = 'outputs/' + key;
      topics.push(outTopic);
      }
    });

  client.on('connect', function () {
    client.subscribe(topics);
  });

  client.on('message', function (topic, message) {
    // message is Buffer
    console.log(topic.toString() + ' ' + message.toString());

  });
}
