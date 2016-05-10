'use strict';
const Proxy = require('./proxy');
const Config = require('./config');

module.exports = function(args) {
	let self = this;
	if(!args) args = {};
	const config = new Config(args);
	const http = new Proxy(config);


	//////////////////////////////////////////////////////////////

	self.thing = args.thing || 'no_thing';

	self.list = (thing, done) => {
		if(!done) throw new ReferenceError('invalid input');
		if(typeof thing !== 'string') thing = self.thing;


		let request = {
			url: http.buildUrl('get/dweets/for', thing),
			data : null,
			method: 'GET'
		};

		http.send(request, function(err, resp, raw) {
			if(err) return done(err, null);

			if(resp.this === 'failed') {
				return done(null, {
					status: resp.with,
					data: [],
					thing: thing
				});
			}

			return done(null, {
				status: 200,
				data: resp.with,
				thing: thing
			});
		});


	};

	self.create = (data, done) => {
		if(!data || !done) throw new ReferenceError('invalid input');

		let request = {
			url: http.buildUrl('dweet/for', self.thing),
			data : data,
			method: 'POST'
		};

		http.send(request, function(err, resp, raw) {
			if(err) return done(err, null);

			if(resp.this === 'failed') {
				return done(null, {
					status: resp.with,
					data: [],
					thing: thing
				});
			}


			return done(null, {
				status: 200,
				data: resp.with,
				thing: self.thing
			});
		});

	}

	return self;
};
