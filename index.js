const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
})