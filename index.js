var express = require('express')
var path = require('path')
var app = express()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()

var account = require('./server/account')


app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
});

app.get('/userinfo', account.getList);
app.get('/userinfo/:id', account.getInfo);
app.post('/create', jsonParser, account.createAccount);
app.post('/update/:id', jsonParser, account.updateAccount);
 
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
