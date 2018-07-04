var db = require('../server/pghelper');

var query = "SELECT * FROM salesforce.Order WHERE sync_status = 'Mobile'";
db.select(query)
.then(function(results) {
  
}, function(err) { console.log(err); })
