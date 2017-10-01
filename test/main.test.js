'use strict';
var expect  = require('chai').expect;
var should = require('chai').should;
var request = require('request');

describe('GET /', () => {
  it('Load web UI', function() {
      request('http://localhost:3000' , function(err, res, body) {
          //expect(response.statusCode).to.equal(200);
          res.should.have.status(200),
          res.should.have.header('Content-Encoding','gzip'),
          res.body.should.have.property('template'),
          expect(err).to.be.null;
          done();
      });
  });

});
