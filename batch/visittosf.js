var db = require('../server/pghelper');
var sf = require('../server/salesforce');

var query = "SELECT * FROM salesforce.Contact WHERE sync_status = 'Mobile'";
db.select(query)
.then(function(results) {
	console.log(results);
	if(results.length > 0)
	{
	
	}
}, function(err) { console.log(err); })
