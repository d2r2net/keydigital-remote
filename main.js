"use strict";
const http =   require('http'),
    fs     =   require('fs'),
    mosca  =   require('mosca'),
    mqttServ  = new mosca.Server({}),
    router    = require('router');



const httpServ = http.createServer(function (req,res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  const html = fs.readFileSync('./public/index.html');
  res.write(html);
  res.end();
});

mqttServ.attachHttpServer(httpServ);

mqttServ.on('clientConnected', function(client) {
	console.log('client connected', client.id);
});

httpServ.listen(3000);
