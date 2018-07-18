var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.sync = function(req, res, next) {
  var head = req.headers['authorization'];
  var lastsync = req.query.syncdate;
  
  auth.authen(head)
	.then(function(obj) {
		var sales = obj.nickname;
		var query = "SELECT *, to_char( systemmodstamp + interval '7 hour', 'YYYY-MM-DD HH24:MI:SS') as updatedate ";
	        query += "FROM salesforce.scale_price__c WHERE systemmodstamp + interval '7 hour' > '" + lastsync + "' ";
		db.select(query) 
		.then(function(results) {
			var output = '{ "success": true, "errorcode" : "", "errormessage" : "", "data":[';
			for(var i = 0 ; i < results.length ; i++)
			{
				output += '{"id":"' + results[i].guid;
				output += '", "pricebookentry":"' + results[i].pricebook_entry__c;
				//output += '", "list_price":' + results[i].list_price__c;
				//output += ', "normal_discount":' + results[i].normal_discount__c;
				output += ', "ltp":' + results[i].ltp__c;
				output += ', "quantity":' + results[i].quantity__c;
				output += ', "discount":' + results[i].discount__c;
				//output += ', "net_price":' + results[i].net_price__c;
				output += ', "foc":' + results[i].foc__c;
				output += ', "isdeleted":' + results[i].isdeleted;
				output += ', "updateddate":"' + results[i].updatedate.replace(" ", "T") + '"},';
			}
			if(results.length > 0)
			{
				output = output.substr(0, output.length - 1);
			}
			output += ']}';
			console.log(output);
			console.log("=====Response=====");
			//res.json(JSON.parse(output));
			res.json([]);
		}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }'); })
	}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"00", "errormessage":"Authen Fail." }'); })
};
