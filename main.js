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

//mqtt client stuff
var client  = mqtt.connect('ws://127.0.0.1:3000')

client.on('connect', function () {
  client.subscribe('outputs/out1');
  client.subscribe('outputs/out2');


});

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(topic.toString() + ' ' + message.toString());
  
});
// const client = mqtt.connect('mqtt://127.0.0.1:3000');
//
// client.on('connect',() => {
//   Object.keys(cmd.outputs).forEach((key) => {
//     var out = outputs[key];
//     console.log('la key: ' + key);
//     if (out.active === true){
//       client.subscribe('outputs/' + out);
//     }
//   });
// });
//
//   client.on('message',(topic,payload) => {
//         console.log(topic.toString + " " + payload.toString);
//         client.end();
//   });
