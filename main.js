"use strict";
const http = require('http'),
  fs = require('fs'),
  cmd = require('./config/cmd'),
  mosca = require('mosca'),
  mime = require('mime'),
  mqttServ = new mosca.Server({}),
  finalhandler = require('finalhandler'),
  nunjucks = require('nunjucks'),
  Router = require('router'),
  router = Router();

//mqtt stuff
const httpServ = http.createServer((req, res) => {
  router(req, res, finalhandler(req, res));
});

mqttServ.attachHttpServer(httpServ);

mqttServ.on('clientConnected', (client) => {
  console.log('client connected', client.id);
});
// webserver stuff
// static assets 
fs.readdir('./public/assets', (err, folders) => {
  folders.forEach(folder => {
    fs.readdir('./public/assets/' + folder, (err, files) => {
      files.forEach(file => {
        router.get('/a/' + folder + '/' + file, (req, res) => {
          const assetPath = './public/assets/' + folder + '/' + file;
          const assetFile = fs.readFileSync('./public/assets/' + folder + '/' + file);
          const assetMime = mime.lookup(assetPath);
          res.writeHead(200, {
            'Content-Type': assetMime
          });
          res.write(assetFile);
          res.end();
        });
      });
    });
  });
});

router.get('/', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  const html = fs.readFileSync('./public/index.html');
  res.write(html);
  res.end();
});

httpServ.listen(3000);
