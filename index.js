var express = require('express')
var path = require('path')
var app = express()

var account = require('./server/account')

//var PORT = process.env.PORT || 5000
app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.get('/userinfo', account.getInfo);