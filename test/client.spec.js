'use strict';
const should = require('chai').should();
const Client = require('../lib');
const Config = require('../lib/config');
const Proxy = require('../lib/proxy');

describe('The HTTP Proxy', () => {
	it('should put a segment together into a URL', () => {
		let http = new Proxy(new Config());
		let result = http.buildUrl('part1');
		result.should.equal('https://thingspace.io/part1');
	});
	it('should put multiple segments together into a URL', () => {
		let http = new Proxy(new Config());
		let result = http.buildUrl('part1', 'part2', 'part3', 'part4');
		result.should.equal('https://thingspace.io/part1/part2/part3/part4');
	});
});

describe('Getting Device Messages from thingspace.io', () => {
	let response = null;
	before((done) => {
		let client = new Client();
		client.list({thing: 'no_thing'}, (err, resp) => {
			response = resp;
			done();
		});
	});

	it('defines a status property', 
    () => response.should.have.property('status'));
	it('defines a data array', 
    () => response.data.should.be.instanceof(Array));
	it('should get 200 when thing is found', 
    () => response.status.should.be.equal(200));
	it('should get 404 when thing not found', (done) => {
		let client = new Client();
		client.list({thing:'asdlfjasdlfjasdfjaks'}, (err, resp) => {
      console.log(resp.status)
			resp.status.should.be.equal(404);
			done();
		});
	});
});
