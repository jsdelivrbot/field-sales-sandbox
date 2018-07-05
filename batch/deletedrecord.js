var db = require('../server/pghelper');

var query = "DELETE FROM salesforce.contact WHERE isdeleted = true ";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.account_team__c WHERE isdeleted = true ";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })

var query = "DELETE FROM salesforce.account WHERE isdeleted = true ";
db.select(query)
.then(function(results) {

}, function(err) { console.log(err); })
