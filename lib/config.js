'use strict';

var Config = function(args){
	var config = { message: {}, ajax: {} };
	config.debug = false;
	config.baseUrl = 'https://thingspace.io';
  config.message.list = '/get/dweets/for';

	if(typeof args === 'object') {
	    if(typeof args.baseUrl !== 'undefined' && args.baseUrl.length > 0) {
	      config.baseUrl = args.baseUrl;
	    }

			if(typeof args.base !== 'undefined' && args.base.length > 0) {
				config.dweet.base = args.base;
			}

	  }
	return config;
};

module.exports = Config;