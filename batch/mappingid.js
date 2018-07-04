var db = require('../server/pghelper');

var query = "SELECT o1.sfid as id, o2.sfid as original, v.sfid as visit ";
query += "FROM salesforce.Order as o1 inner join salesforce.Order as o2 on o1.originalorder_guid = o2.guid";
query += "inner join salesforce.call_visit__c as v on v.guid = o1.visit_guid";
db.select(query)
.then(function(results) {
  
}, function(err) { console.log(err); })
