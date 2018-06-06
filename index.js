var express = require('express')
var path = require('path')
var app = express()
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()

var salesman = require('./server/salesman')
var account = require('./server/account')

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
});

app.post('/createsalesman', jsonParser, salesman.createSalesman);
app.get('/userinfo/:id', salesman.getInfo);

app.get('/accountlist', account.getList);
app.get('/accountinfo/:id', account.getInfo);
app.post('/createaccount', jsonParser, account.createAccount);
app.post('/updateaccount/:id', jsonParser, account.updateAccount);
app.get('/deleteaccount/:id', account.deleteAccount);

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
