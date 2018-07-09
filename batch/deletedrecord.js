var db = require('../server/pghelper');

var query = "DELETE FROM salesforce.order_product__c WHERE isdeleted = true RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.order__c WHERE isdeleted = true RETURNING *";
db.select(query)
.then(function(results) {
  var orderList = "(";
	for(var i = 0 ; i < results.length ; i++)
	{
		orderList += "'" + results[i].sfid + "', ";
	}
	orderList = orderList.substr(0, orderList.length - 2);
	orderList += ")";
	
	var query2 = "DELETE FROM salesforce.order_product__c WHERE order__c IN " + orderList;
	db.select(query2)
	.then(function(results2) {
	
	}, function(err) { console.log(err); })
	
	var query3 = "UPDATE salesforce.order as o SET originalorderid = null WHERE originalorderid IN " + orderList;
	db.select(query3)
	.then(function(results3) {
	
	}, function(err) { console.log(err); })
}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.scale_price__c WHERE isdeleted = true RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.pricebook_entry__c WHERE isdeleted = true RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.pricebook2 WHERE isdeleted = true RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.product2 WHERE isdeleted = true RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.promotion__c WHERE isdeleted = true RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.salesman__c WHERE isdeleted = true RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.top_store_program__c WHERE isdeleted = true RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.product_history__c WHERE isdeleted = true RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.good_return__c WHERE isdeleted = true RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.call_card__c WHERE isdeleted = true RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.call_visit__c WHERE isdeleted = true RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.invoice__c WHERE isdeleted = true RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.contact WHERE isdeleted = true RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.account_team__c WHERE isdeleted = true RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.account WHERE isdeleted = true RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })
