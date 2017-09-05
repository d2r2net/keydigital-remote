"use strict";
const http =   require('http'),
    fs     =   require('fs'),
    mosca  =   require('mosca'),
    mqttServ  = new mosca.Server({}),
    finalhandler = require('finalhandler'),
    Router    = require('router'),
    router   = Router();


fs.readdir('./public/assets', (err,folders) => {
  folders.forEach(folder => {
    fs.readdir('./public/assets/' + folder, (err,files) => {
      files.forEach(file => {
        router.get('/a/' + folder + '/' + file,(req,res) => {
          res.writeHead(200,{'Content-Type':'text/javascript'});
          const assetUrl = fs.readFileSync('./public/assets/' + folder + '/' + file);
          res.write(assetUrl);
          res.end();
        });
      });
    });
  });
});



router.get('/',(req,res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  const html = fs.readFileSync('./public/index.html');
  res.write(html);
  res.end();
});



const httpServ = http.createServer((req,res) => {
router(req,res,finalhandler(req,res));
});

mqttServ.attachHttpServer(httpServ);

mqttServ.on('clientConnected', (client) => {
	console.log('client connected', client.id);
});

httpServ.listen(3000);
