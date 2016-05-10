'use strict';
const Proxy = require('./proxy');
const Config = require('./config');

module.exports = function(args) {
	let self = this;
	if(!args) args = {};
	const config = new Config(args);
	const http = new Proxy(config);
	
	self.thing = args.thing || 'no_thing';

	self.list = (args, done) => {
		let thing = self.thing;
		if(args && args.thing) {
			thing = args.thing;
		}
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
};
