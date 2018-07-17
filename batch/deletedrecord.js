var db = require('../server/pghelper');

var query = "DELETE FROM salesforce.order_product__c WHERE isdeleted = true and systemmodstamp < NOW() - interval '1 months' RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.order__c WHERE isdeleted = true and systemmodstamp < NOW() - interval '1 months' RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.scale_price__c WHERE isdeleted = true and systemmodstamp < NOW() - interval '1 months' RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.pricebook_entry__c WHERE isdeleted = true and systemmodstamp < NOW() - interval '1 months' RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.pricebook2 WHERE isdeleted = true and systemmodstamp < NOW() - interval '1 months' RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.product2 WHERE isdeleted = true and systemmodstamp < NOW() - interval '1 months' RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.product_group__c WHERE isdeleted = and systemmodstamp < NOW() - interval '1 months' true RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.promotion__c WHERE isdeleted = true and systemmodstamp < NOW() - interval '1 months' RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.top_store_program__c WHERE isdeleted = true and systemmodstamp < NOW() - interval '1 months' RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.product_history__c WHERE isdeleted = true and systemmodstamp < NOW() - interval '1 months' RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.good_return__c WHERE isdeleted = true and systemmodstamp < NOW() - interval '1 months' RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.call_card__c WHERE isdeleted = true and systemmodstamp < NOW() - interval '1 months' RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.call_visit__c WHERE isdeleted = true and systemmodstamp < NOW() - interval '1 months' RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.invoice__c WHERE isdeleted = true and systemmodstamp < NOW() - interval '1 months' RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.contact WHERE isdeleted = true and systemmodstamp < NOW() - interval '1 months' RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.account_team__c WHERE isdeleted = true and systemmodstamp < NOW() - interval '1 months' RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.account WHERE isdeleted = true and systemmodstamp < NOW() - interval '1 months' RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.salesman__c WHERE isdeleted = true and systemmodstamp < NOW() - interval '1 months' RETURNING *";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })
