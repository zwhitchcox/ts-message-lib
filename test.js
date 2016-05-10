var fetch = require('node-fetch')
fetch(null)
  .then(resp => resp.text())
  .then(json => console.log(json))
