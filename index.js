var express = require('express')
var path = require('path')
var app = express()
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()

var salesman = require('./server/salesman')
var account = require('./server/account')
var accountTeam = require('./server/accountteam')
var contact = require('./server/contact')
var topProgram = require('./server/topstoreprogram')
var promotion = require('./server/promotion')
var history = require('./server/history')
var product = require('./server/product')
var pricebook = require('./server/pricebook')
var pricebookentry = require('./server/pricebookentry')
var scaleprice = require('./server/scaleprice')
var callvisit = require('./server/callvisit')
var invoice = require('./server/invoice')

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
});

app.post('/createsalesman', jsonParser, salesman.createSalesman);
app.post('/updatesalesman/:id', jsonParser, salesman.updateSalesman);
//app.post('/upsertsalesman', jsonParser, salesman.upsertSalesman);
app.get('/deletesalesman/:id', salesman.deleteSalesman);
app.get('/userinfo/:id', salesman.getInfo);
app.post('/login', urlencodedParser, salesman.login);

app.post('/createaccount', jsonParser, account.createAccount);
app.post('/updateaccount/:id', jsonParser, account.updateAccount);
app.get('/deleteaccount/:id', account.deleteAccount);
app.get('/accountlist', account.getList);
app.get('/accountinfo/:id', account.getInfo);

app.post('/createaccountteam', jsonParser, accountTeam.createAccountTeam);
app.get('/deleteaccountteam/:id', accountTeam.deleteAccountTeam);

app.post('/createcontact', jsonParser, contact.createContact);
app.post('/updatecontact/:id', jsonParser, contact.updateContact);
app.get('/deletecontact/:id', contact.deleteContact);

app.post('/createtopprogram', jsonParser, topProgram.createTopStore);
app.post('/updatetopprogram/:id', jsonParser, topProgram.updateTopStore);
app.get('/deletetopprogram/:id', topProgram.deleteTopStore);

app.post('/createpromotion', jsonParser, promotion.createPromotion);
app.post('/updatepromotion/:id', jsonParser, promotion.updatePromotion);
app.get('/deletepromotion/:id', promotion.deletePromotion);

app.post('/createhistory', jsonParser, history.createHistory);
app.post('/updatehistory/:id', jsonParser, history.updateHistory);
app.get('/deletehistory/:id', history.deleteHistory);

app.post('/createproduct', jsonParser, product.createProduct);
app.post('/updateproduct/:id', jsonParser, product.updateProduct);
app.get('/deleteproduct/:id', product.deleteProduct);

app.post('/createpricebook', jsonParser, pricebook.createPricebook);
app.post('/updatepricebook/:id', jsonParser, pricebook.updatePricebook);
app.get('/deletepricebook/:id', pricebook.deletePricebook);

app.post('/createpricebookentry', jsonParser, pricebookentry.createPricebookentry);
app.post('/updatepricebookentry/:id', jsonParser, pricebookentry.updatePricebookentry);
app.get('/deletepricebookentry/:id', pricebookentry.deletePricebookentry);

app.post('/createscaleprice', jsonParser, scaleprice.createSalesPrice);
app.post('/updatescaleprice/:id', jsonParser, scaleprice.updateSalesPrice);
app.get('/deletescaleprice/:id', scaleprice.deleteSalesPrice);

app.post('/createcallvisit', jsonParser, callvisit.createCallVisit);
app.post('/updatecallvisit/:id', jsonParser, callvisit.updateCallVisit);
app.get('/deletecallvisit/:id', callvisit.deleteCallVisit);

app.post('/createinvoice', jsonParser, invoice.createInvoice);
app.post('/updateinvoice/:id', jsonParser, invoice.updateInvoice);
app.get('/deleteinvoice/:id', invoice.deleteInvoice);

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
