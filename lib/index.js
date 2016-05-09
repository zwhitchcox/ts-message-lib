'use strict';
const Proxy = require('./proxy');
const Config = require('./config');

let Client = function(args) {
	let self = this;

	const config = new Config(args);
	const http = new Proxy(config);
	const thing = args.thing || 'no_thing';

	self.list = (done) => {
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
					data: [{thing: thing, content: []}]
				});
			}

			return done(null, {
					status: 200,
					data: resp.with,
					thing: thing
				});
		});
	}
}

module.exports = Client;