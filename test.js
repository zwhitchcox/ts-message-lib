var fetch = require('node-fetch')
fetch('https://thingspace.io/get/dweets/for/no_thing')
  .then(resp => resp.json())
  .then(json => console.log(json))
