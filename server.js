"use strict";
const express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  config = require('./config/config'),
  compression = require('compression'),
  mqtt = require('mqtt'),
  mosca = require('mosca'),
  mqttServ = new mosca.Server({}),
  nunjucks = require('nunjucks'),
  minifyHTML = require('express-minify-html'),
  SerialPort = require('serialport');
  //serial port
  const port = new SerialPort(config.serial.port,{
  baudRate: config.serial.baudRate
  });

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
  serveur:config.serveur.url,
  port:config.serveur.port,
  inputs:config.inputs,
  outputs:config.outputs};
// render nunjucks view
  res.render('index.html',data);
  console.log(data.serveur);

});
// start express server
server.listen(config.serveur.port);
mqttClient();
// mqtt client stuff
function mqttClient() {
  //client connection to mqtt server
  var client  = mqtt.connect('ws://' + config.serveur.url + ':' + config.serveur.port);
  //mqtt topic array
   const topics = [];
 // find active output
  Object.keys(config.outputs).forEach((key) => {
      var out = config.outputs[key];
      //create active out mqtt topic array
     if (out.active === true){
       //create mqtt topic
      const outTopic = 'outputs/' + key;
      topics.push(outTopic);
      }
    });// /Object.keys

  client.on('connect', function () {
    // subscribe on active ouput mqtt channels
    client.subscribe(topics);
  });
//trigger when a mqtt message is reseived
  client.on('message', function (topic, message) {
    // message is Buffer .
    console.log(topic.toString() + ' ' + message.toString());
    //write data to serial port
    serialconfig(topic,message);
  });
}

function serialconfig(topic,message) {

  //output
  const oKey = topic.toString().substring(topic.indexOf('/') +1);
  //command to be send
  const command = new Buffer (config.outputs[oKey].cmd + config.inputs[message].cmd + '\r\n',"ascii");
  console.log(command);
  port.write(command, function(err, results) {
    if(err)
    console.log('err ' + err);
    console.log('results ' + results);

});


}//serialconfig
