"use strict";
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var Config = require('./config');

var cookieRegex =  /^(\w*=\w*)/;


var Proxy = function(args) {
  var self = this;
  self.cookie = [];

  var debug = args.debug;
  var baseUrl = args.baseUrl;
  var config = args.ajax;

  var Debug = function(location, data) {
    if(debug) { console.log(location, data); }
  }

  var SendError = function(evt, callback) {
    Debug('Proxy.error', JSON.stringify(evt));

    callback(evt.currentTarget, null, null);
  }

  var SendResponse = function(raw, callback) {
    Debug('Proxy.response received', [raw.status, raw.responseText]);
    var err = null;

    try {
      var response = null;

      if (raw.status >= 200 && raw.status < 300) {
        response = JSON.parse(raw.responseText);

        if (response.error === true) {
          err = response;
          response = null;
        }

      } else {
        err = JSON.parse(raw.responseText);
      }

    } catch (e) {
      err = raw.responseText;
    }

    callback (err, response, raw);
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
    var http = new XMLHttpRequest();
    var data = Encode(request.data);
    var cookieHeader = GetCookieHeader();


    if (request.method === 'GET') {
      request.url = request.url + '?' + data;
    }

    // ADD EVENT LISTENERS
    http.addEventListener('load', function() {
      SetCookie(this.getResponseHeader('Set-Cookie'));
      SendResponse(this, callback);
    });
    http.addEventListener('error', function() {
      SendError(this, callback);
    });

    http.open(request.method, request.url, true);
    http.withCredentials = true;

    if (self.cookie.length > 0) {
      http.setDisableHeaderCheck(true);
      http.setRequestHeader('Cookie', GetCookieHeader());
    }

    Debug('Proxy.ajax send', [request.method, request.url, data, cookieHeader] )

    if (request.method === 'GET') {
      http.send();
    }
    else {
      http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      http.send(data);
    }

  };

  return self;
};

module.exports = Proxy;