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
			var output = { "success": true, "errorcode" : "", "errormessage" : "", "data": results };
			res.json(output);
		}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }'); })
	}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"00", "errormessage":"Authen Fail." }'); })
}

exports.sync = function(req, res, next) {
  var head = req.headers['authorization'];
  var lastsync = req.query.syncdate;
  
  auth.authen(head)
	.then(function(obj) {
		var sales = obj.nickname;
		var query = "SELECT *, to_char( systemmodstamp + interval '7 hour' , 'YYYY-MM-DD HH24:MI:SS') as updatedate ";
	        query += "FROM salesforce.product_group__c WHERE systemmodstamp + interval '7 hour' > '" + lastsync + "'";
		db.select(query) 
		.then(function(results) {
			/*
			var output = '{ "success": true, "errorcode" : "", "errormessage" : "", "data":[';
			for(var i = 0 ; i < results.length ; i++)
			{
				output += '{"id":"' + results[i].sfid;
				output += '", "name":"' + results[i].name;
				output += '", "columnname":"' + results[i].column_name__c;
				output += '", "division":"' + results[i].division__c;
				output += '", "parent":"' + results[i].parent__c;
				output += '", "updatedate":"' + results[i].updatedate.replace(" ", "T") + '"},';
			}
			if(results.length)
			{
				output = output.substr(0, output.length - 1);
			}
			output += ']}';
			console.log(output);
			res.json(JSON.parse(output));
			*/
			var output = { "success": true, "errorcode" : "", "errormessage" : "", "data":[]};
			for(var i = 0 ; i < results.length ; i++)
			{
				output.data.push({"id": results[i].sfid, "name": results[i].name, "columnname": results[i].column_name__c,
						  "division": results[i].division__c, "parent": (results[i].parent__c != null ? results[i].parent__c : "root"),
						  "updatedate": results[i].updatedate.replace(" ", "T") + "+07:00"});
			}
			res.json(output);
		}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }'); })
	}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"00", "errormessage":"Authen Fail." }'); })
};
