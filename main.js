"use strict";
const express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  cmd = require('./config/cmd'),
  compression = require('compression'),
  mqtt = require('mqtt'),
  mosca = require('mosca'),
  mqttServ = new mosca.Server({}),
  nunjucks = require('nunjucks'),
  minifyHTML = require('express-minify-html'),
  SerialPort = require('serialport');



//nunjucks config
nunjucks.configure('views', {
    autoescape: true,
    cache: false,
    express: app
});

app.use(minifyHTML({
    override:      true,
    exception_url: false,
    htmlMinifier: {
        removeComments:            true,
        collapseWhitespace:        true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes:     true,
        removeEmptyAttributes:     true,
        minifyJS:                  true
    }
}));

//express config
app.use('/a', express.static('public/assets'));
app.use(compression());

//mqtt server  stuff
mqttServ.attachHttpServer(server);

mqttServ.on('clientConnected', (client) => {
  console.log('client connected', client.id);
});

// web server
app.get('/',(req,res) => {
  var data = {
  serveur:cmd.serveur.url,
  inputs:cmd.inputs,
  outputs:cmd.outputs};

  res.render('index.html',data);
  console.log(data.serveur);

});
server.listen(cmd.serveur.port);
mqttClient();

function mqttClient() {
  var client  = mqtt.connect('ws://' + cmd.serveur.url + ':' + cmd.serveur.port);
   const topics = [];

  Object.keys(cmd.outputs).forEach((key) => {
      var out = cmd.outputs[key];


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
