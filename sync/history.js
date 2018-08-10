var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.sync = function(req, res, next) {
	var head = req.headers['authorization'];
	var lastsync = req.body.syncdate;
	
	auth.authen(head)
	.then(function(obj) {
		var sales = obj.nickname;
		var query = "SELECT * FROM salesforce.Account WHERE sfid IN ";
		query += "(SELECT account__c FROM salesforce.account_team__c WHERE LOWER(salesman__c) = '" + sales + "')";
		db.select(query) 
		.then(function(results) {
			if(results.length > 0)
			{
				var accountList = "(";
				for(var i = 0 ; i < results.length ; i++)
				{
					accountList += "'" + results[i].sfid + "', ";
				}
				accountList = accountList.substr(0, accountList.length - 2);
				accountList += ")";
								
				var query2 = "SELECT guid as id, name, account__c as account, product__c as product, predict, ";
				//query2 += "success as Success, errorcode as ErrorCode, errormessage as ErrorMessage, ";
				query2 += "to_char( systemmodstamp + interval '7 hour', 'YYYY-MM-DD HH24:MI:SS') as updatedate , isdeleted "
				query2 += "from salesforce.product_history__c where (account__c IN " + accountList + " and ";
				query2 += "systemmodstamp + interval '7 hour' > '" + lastsync + "') ";
				db.select(query2)
				.then(function(results2) {
					/*
					var output = '{ "success": true, "errorcode" : "", "errormessage" : "", "data":[';
					for(var i = 0 ; i < results.length ; i++)
					{
						output += '{"id":"' + results[i].guid;
						output += '", "name":"' + results[i].name;
						output += '", "account":"' + results[i].account;
						output += '", "product":"' + results[i].product;
						output += '", "isdeleted":' + results[i].isdeleted;
						output += ', "updateddate":"' + results[i].updatedate.replace(" ", "T") + '"},';
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
						output.data.push({"id": results[i].guid, "name": results[i].name, "account": results[i].account,
								  "product": results[i].product, "predict" : results[i].predict, "isdeleted": results[i].isdeleted, 
								  "updateddate": results[i].updatedate.replace(" ", "T") + "+07:00" });
					}
					res.json(output);
				}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }'); })
			} else { res.status(887).send('{ "success": false, "errorcode" :"02", "errormessage":"No Account" }'); }
		}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }'); })
	}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"00", "errormessage":"Authen Fail." }'); })
};
