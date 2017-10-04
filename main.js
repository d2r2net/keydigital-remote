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

  //serial port
  const port = new SerialPort(cmd.serial.port,{
  baudRate: 57600
});
port.write('SPO01SI04');

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
// render nunjucks view
  res.render('index.html',data);
  console.log(data.serveur);

});
// start express server
server.listen(cmd.serveur.port);
mqttClient();
// mqtt client stuff
function mqttClient() {
  //client connection to mqtt server
  var client  = mqtt.connect('ws://' + cmd.serveur.url + ':' + cmd.serveur.port);
  //mqtt topic array
   const topics = [];
 // find active output
  Object.keys(cmd.outputs).forEach((key) => {
      var out = cmd.outputs[key];
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
    serialCmd(topic,message);
  });
}

function serialCmd(topic,message) {

  //output
  const oKey = topic.toString().substring(topic.indexOf('/') +1);
  //command to be send
  const command = new Buffer (cmd.outputs[oKey].cmd + cmd.inputs[message].cmd + '\r\n',"ascii");
  console.log(command);
  port.write(command, function(err, results) {
    if(err)
    console.log('err ' + err);
    console.log('results ' + results);

});


}//serialCmd
