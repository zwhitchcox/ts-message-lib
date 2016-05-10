"use strict";
var objectAssign = require('object-assign')
var fetch = require('../fetch')
var cookieRegex =  /^(\w*=\w*)/;


var Proxy = function(args) {
  var self = this;
  self.cookie = [];

  var debug = args.debug;
  var baseUrl = args.baseUrl;

  var Debug = function(location, data) {
    if(debug) { console.log(location, data); }
  }

  var SetCookie = function(input) {

    if(input === null) { return; }

    for (var i=0, count=input.length; i<count; i++) {
      var newCookie = cookieRegex.exec(input[i]);

      if (newCookie && newCookie.length > 0){
        self.cookie.push(newCookie[0]);
      }
    }

    Debug('Proxy.SetCookie', input);
  };

  var GetCookieHeader = function() {
    var cookies = "";

    for (var i=0, count=self.cookie.length; i<count;i++) {
      if (i > 0) { cookies += "; "; }
      cookies += self.cookie[i];
    }
    Debug('Proxy.CookieHeader', cookies);

    return cookies;
  };

  var Encode = function (data) {
    var form = '';
    for (var name in data) {
      if (data.hasOwnProperty(name)) {
        if (form !== '') form += '&';
        form += encodeURIComponent(name) + '=' + encodeURIComponent(data[name]);
        form.replace(/%20/g, '+');
      }
    }
    Debug('Proxy.encode', [data, form]);

    return form;
  };


  self.buildUrl = function(args) {
    var result = baseUrl;

    for (var i=0, l = arguments.length; i < l; i++){
      result += '/' + arguments[i];
    }

    return result;
  };



  self.send = function(request, callback) {
    var isGet       = request.method === 'GET'
    var hasCookies  = self.cookie.length > 0
    var response;
    fetch(request.url + (isGet ? '?' + Encode(request.data) : ''),
      objectAssign(
        isGet ? { } : {body: JSON.stringify(request.data)},
        {
          method: request.method || 'GET',
          headers: objectAssign(
            hasCookies ? { Cookie: GetCookieHeader() } : {},
            isGet ? { } :
              { 'Content-Type': 'application/x-www-form-urlencoded'}
          ),
        }
      )
    )
    .then(function(resp) { 
      var cookie;
      response = resp
      if (cookie = resp.headers.get('Set-Cookie'))
        SetCookie(cookie);
      return resp.text()
    })
    .then(function(raw) { 
      return callback(null, JSON.parse(raw), raw) 
    })
    .catch(function (err) {
      callback(response,err)
    })
    return self;
  }
};

module.exports = Proxy;
