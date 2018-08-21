var express = require('express')
var path = require('path')
var app = express()
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()
const uuidv4 = require('uuid/v4')

var salesman = require('./server/salesman')
var account = require('./server/account')
var accountTeam = require('./server/accountteam')
var contact = require('./server/contact')
var topProgram = require('./server/topstoreprogram')
var promotion = require('./server/promotion')
var history = require('./server/history')
var productGroup = require('./server/productgroup')
var product = require('./server/product')
var pricebook = require('./server/pricebook')
var pricebookentry = require('./server/pricebookentry')
var scaleprice = require('./server/scaleprice')
var callvisit = require('./server/callvisit')
var callcard = require('./server/callcard')
var goodreturn = require('./server/goodreturn')
var order = require('./server/order')
var orderproduct = require('./server/orderproduct')
var invoice = require('./server/invoice')

var db = require('./server/pghelper');

var util = require('./sync/Util');

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.use(express.json({limit: '50mb'}));
//app.use(express.urlencoded({limit: '50mb'}));

app.get('/test', function(request, response) {
  //var date = new Date("2018-07-02 08:30:00");
  response.send("" + uuidv4());
});
app.post('/test', jsonParser, function(request, response) {
  db.init()
  .then(function(conn) {
    console.log("===============init success===================");
    db.query("Select * From salesforce.account", conn)
    .then(function(results){
      console.log("=================query1======================");
      db.query("Select * From salesforce.salesman__c", conn)
      .then(function(results2){
       console.log("=================query2======================");
       response.json(results2);
      })
    })
  })
});

app.post('/createsalesman', jsonParser, salesman.createSalesman);
app.post('/updatesalesman/:id', jsonParser, salesman.updateSalesman);
//app.post('/upsertsalesman', jsonParser, salesman.upsertSalesman);
app.get('/deletesalesman/:id', salesman.deleteSalesman);
app.get('/userinfo/:id', salesman.getInfo);
app.post('/login', urlencodedParser, salesman.login);
app.post('/loginpin', urlencodedParser, salesman.loginpin);

app.post('/createaccount', jsonParser, account.createAccount);
app.post('/createaccountlist', jsonParser, account.createAccountList);
app.post('/updateaccount/:id', jsonParser, account.updateAccount);
app.post('/updateaccountlist', jsonParser, account.updateAccountList);
app.get('/deleteaccount/:id', account.deleteAccount);
app.post('/deleteaccountlist', jsonParser, account.deleteAccountList);
app.get('/accountlist', account.getList);
app.post('/updateaccountmobile/:id', jsonParser, account.updateAccount2);
app.get('/accountinfo/:id', account.getInfo);

app.post('/createaccountteam', jsonParser, accountTeam.createAccountTeam);
app.post('/createaccountteamlist', jsonParser, accountTeam.createAccountTeamList);
app.get('/deleteaccountteam/:id', accountTeam.deleteAccountTeam);
app.post('/deleteaccountteamlist', jsonParser, accountTeam.deleteAccountTeamList);

app.post('/createcontact', jsonParser, contact.createContact);
app.post('/createcontactlist', jsonParser, contact.createContactList);
app.post('/updatecontact/:id', jsonParser, contact.updateContact);
app.post('/updatecontactlist', jsonParser, contact.updateContactList);
app.get('/deletecontact/:id', contact.deleteContact);
app.post('/deletecontactlist', jsonParser, contact.deleteContactList);
app.post('/createcontactmobile', jsonParser, contact.createContact2);
app.post('/updatecontactmobile/:id', jsonParser, contact.updateContact2);

app.post('/createtopprogram', jsonParser, topProgram.createTopStore);
app.post('/createtopprogramlist', jsonParser, topProgram.createTopStoreList);
app.post('/updatetopprogram/:id', jsonParser, topProgram.updateTopStore);
app.post('/updatetopprogramlist', jsonParser, topProgram.updateTopStoreList);
app.get('/deletetopprogram/:id', topProgram.deleteTopStore);
app.post('/deletetopprogramlist', jsonParser, topProgram.deleteTopStoreList);

app.get('/promotionlist', promotion.getList);
app.post('/createpromotion', jsonParser, promotion.createPromotion);
app.post('/createpromotionlist', jsonParser, promotion.createPromotionList);
app.post('/updatepromotion/:id', jsonParser, promotion.updatePromotion);
app.post('/updatepromotionlist', jsonParser, promotion.updatePromotionList);
app.get('/deletepromotion/:id', promotion.deletePromotion);
app.post('/deletepromotionlist', jsonParser, promotion.deletePromotionList);

app.post('/createhistory', jsonParser, history.createHistory);
app.post('/createhistorylist', jsonParser, history.createHistoryList);
app.post('/updatehistory/:id', jsonParser, history.updateHistory);
app.post('/updatehistorylist', jsonParser, history.updateHistoryList);
app.get('/deletehistory/:id', history.deleteHistory);
app.post('/deletehistorylist', jsonParser, history.updateHistoryList);

app.post('/createproductgrouplist', jsonParser, productGroup.createGroupList);
app.post('/updateproducgrouptlist', jsonParser, productGroup.updateGroupList);
app.post('/deleteproductgrouplist', jsonParser, productGroup.deleteGroupList);

app.get('/productlist', product.getProducts);
app.get('/pricelist', product.getPrices);
app.post('/createproduct', jsonParser, product.createProduct);
app.post('/createproductlist', jsonParser, product.createProductList);
app.post('/updateproduct/:id', jsonParser, product.updateProduct);
app.post('/updateproductlist', jsonParser, product.updateProductList);
app.get('/deleteproduct/:id', product.deleteProduct);
app.post('/deleteproductlist', jsonParser, product.deleteProductList);

app.post('/createpricebook', jsonParser, pricebook.createPricebook);
app.post('/createpricebooklist', jsonParser, pricebook.createPricebookList);
app.post('/updatepricebook/:id', jsonParser, pricebook.updatePricebook);
app.post('/updatepricebooklist', jsonParser, pricebook.updatePricebookList);
app.get('/deletepricebook/:id', pricebook.deletePricebook);
app.post('/deletepricebooklist', jsonParser, pricebook.deletePricebookList);

app.post('/createpricebookentry', jsonParser, pricebookentry.createPricebookentry);
app.post('/createpricebookentrylist', jsonParser, pricebookentry.createPricebookentryList);
app.post('/updatepricebookentry/:id', jsonParser, pricebookentry.updatePricebookentry);
app.post('/updatepricebookentrylist', jsonParser, pricebookentry.updatePricebookentryList);
app.get('/deletepricebookentry/:id', pricebookentry.deletePricebookentry);
app.post('/deletepricebookentrylist', jsonParser, pricebookentry.deletePricebookentryList);

app.post('/createscaleprice', jsonParser, scaleprice.createSalesPrice);
app.post('/createscalepricelist', jsonParser, scaleprice.createSalesPriceList);
app.post('/updatescaleprice/:id', jsonParser, scaleprice.updateSalesPrice);
app.post('/updatescalepricelist', jsonParser, scaleprice.updateSalesPriceList);
app.get('/deletescaleprice/:id', scaleprice.deleteSalesPrice);
app.post('/deletescalepricelist', jsonParser, scaleprice.deleteSalesPriceList);

app.post('/createcallvisit', jsonParser, callvisit.createCallVisit);
app.post('/createcallvisitlist', jsonParser, callvisit.createCallVisitList);
app.post('/updatecallvisit/:id', jsonParser, callvisit.updateCallVisit);
app.post('/updatecallvisitlist', jsonParser, callvisit.updateCallVisitList);
app.get('/deletecallvisit/:id', callvisit.deleteCallVisit);
app.post('/deletecallvisitlist', jsonParser, callvisit.deleteCallVisitList);
app.get('/callvisitlist',callvisit.getList );
app.post('/createcallvisitmobile', jsonParser, callvisit.createCallVisit2);
app.post('/updatecallvisitmobile/:id', jsonParser, callvisit.updateCallVisit2);

app.post('/createcallcard', jsonParser, callcard.createCallCard);
app.post('/createcallcardlist', jsonParser, callcard.createCallCardList);
app.post('/updatecallcard/:id', jsonParser, callcard.updateCallCard);
app.post('/updatecallcardlist', jsonParser, callcard.updateCallCardList);
app.get('/deletecallcard/:id', callcard.deleteCallCard);
app.post('/deletecallcardlist', jsonParser, callcard.deleteCallCardList);

app.post('/createreturnlist', jsonParser, goodreturn.createReturnList);
app.post('/updatereturnlist', jsonParser, goodreturn.updateReturnList);
app.post('/deletereturnlist', jsonParser, goodreturn.deleteReturnList);

app.get('/orderlist', order.getList);
app.post('/createorder', jsonParser, order.createOrder);
app.post('/createorderlist', jsonParser, order.createOrderList);
app.post('/updateorder/:id', jsonParser, order.updateOrder);
app.post('/updateorderlist', jsonParser, order.updateOrderList);
app.get('/deleteorder/:id', order.deleteOrder);
app.post('/deleteorderlist', jsonParser, order.deleteOrderList);

app.post('/createorderproductlist', jsonParser, orderproduct.createOrderProductList);
app.post('/updateorderproductlist', jsonParser, orderproduct.updateOrderProductList);
app.post('/deleteorderproductlist', jsonParser, orderproduct.deleteOrderProductList);

app.post('/createinvoice', jsonParser, invoice.createInvoice);
app.post('/createinvoicelist', jsonParser, invoice.createInvoiceList);
app.post('/updateinvoice/:id', jsonParser, invoice.updateInvoice);
app.post('/updateinvoicelist', jsonParser, invoice.updateInvoiceList);
app.get('/deleteinvoice/:id', invoice.deleteInvoice);
app.post('/deleteinvoicelist', jsonParser, invoice.deleteInvoiceList);

var account2 = require('./sync/account')
var contact2 = require('./sync/contact')
var productGroup2 = require('./sync/productgroup')
var product2 = require('./sync/product')
var pricebook2 = require('./sync/pricebook')
var pricebookentry2 = require('./sync/pricebookentry')
var scale2 = require('./sync/scaleprice')
var order2 = require('./sync/order')
var orderproduct2 = require('./sync/orderproduct')
var program2 = require('./sync/topprogram')
var calllvisit2 = require('./sync/callvisit')
var callcard2 = require('./sync/callcard')
var goodreturn2 = require('./sync/goodreturn')
var promotion2 = require('./sync/promotion')
var history2 = require('./sync/history')
var invoice2 = require('./sync/invoice')

app.get('/syncaccount', account2.sync);
app.post('/synccontact', jsonParser, contact2.sync);
app.get('/syncproductgroup', productGroup2.sync);
app.get('/syncproduct', product2.sync);
app.get('/syncpricebook', pricebook2.sync);
app.get('/syncpricebookentry', pricebookentry2.sync);
app.get('/syncscale', scale2.sync);
app.post('/syncorder', jsonParser, order2.sync);
app.post('/syncorderproduct', jsonParser, orderproduct2.sync);
app.post('/syncprogram', jsonParser, program2.sync);
app.post('/syncvisit', jsonParser, calllvisit2.sync);
app.post('/synccallcard', jsonParser, callcard2.sync);
app.post('/syncgoodreturn', jsonParser, goodreturn2.sync);
app.get('/syncpromotion', promotion2.sync);
app.get('/synchistory', history2.sync);
app.get('/syncinvoice', invoice2.sync);

//console.log("=====================================");
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
