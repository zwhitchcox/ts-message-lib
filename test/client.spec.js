'use strict';
const should = require('chai').should();
const expect = require('chai').expect;
const uuid = require('node-uuid');
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

describe('The Client', () => {
	let client = new Client();
	client.thing = uuid.v4();

	describe('Sending Message to thingspace.io', () => {
		it('defines a function create', () => client.create.should.be.function );
		it('requires data arguments', () => expect(() => client.create(null, null)).to.throw('invalid input'));
		it('requires a callback', () => expect(() => client.create({}, null)).to.throw('invalid input'));

		it('Creates a message and returns success', (done) => {
			client.create({unit: 'test'}, function(err, resp) {
				resp.status.should.be.equal(200);
				done();
			});
		});
	});

	describe('Retrieving Messages from thingspace.io', () => {
		let response = null;

		it('defines a function list', () => client.list.should.be.function );
		it('requires a callback', () => expect(() => client.list(null, null)).to.throw('invalid input'));
		it('should get 200 when thing is found', (done) => {
			client.list(null, (err, resp) => {
				resp.status.should.be.equal(200);
				response = resp;
				done();
			});
		});
		it('should get 404 when thing not found', (done) => {
			client.list(uuid.v4(), (err, resp) => {
				resp.status.should.be.equal(404);
				done();
			});
		});
		it('defines a status property', () => response.should.have.property('status'));
		it('defines a data array', () => response.data.should.be.instanceof(Array));

	});
});




