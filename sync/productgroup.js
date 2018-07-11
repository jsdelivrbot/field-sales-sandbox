var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.getProductGroup = function(req, res, next) {
	var head = req.headers['authorization'];
	
	auth.authen(head)
	.then(function(obj) {
		var sales = obj.nickname;
		var query = "select * from (";
		query += "select null as parent ,Product_group__c as group, 'Brand' as columnname from salesforce.Product2 Group by Product_group__c ";
		query += "Union All ";
		query += "select Product_group__c as Parent , Family as group, 'Family' as columnname FROM salesforce.product2 group by (Product_group__c,Family) ";
		query += "Union All ";
		query += "select Family as Parent , Product_type__c as group, 'Type' as columnname FROM salesforce.product2 group by (Family,Product_type__c)";
		query += ") as t order by columnname asc";
		console.log(query);

		db.select(query)
		.then(function(results) {
			res.json(results);
		}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }'); })
	}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"00", "errormessage":"Authen Fail." }'); })
}
