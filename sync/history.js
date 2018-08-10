var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.sync = function(req, res, next) {
	var head = req.headers['authorization'];
	var lastsync = req.query.syncdate;
	
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
				query2 += "to_char( systemmodstamp + interval '7 hour', 'YYYY-MM-DD HH24:MI:SS') as updateddate, isdeleted "
				query2 += "from salesforce.product_history__c where (account__c IN " + accountList + " and ";
				query2 += "systemmodstamp + interval '7 hour' > '" + lastsync + "') ";
				db.select(query2)
				.then(function(results2) {
					/*
					var output = '{ "success": true, "errorcode" : "", "errormessage" : "", "data":[';
					for(var i = 0 ; i < results.length ; i++)
					{
						output += '{"id":"' + results2[i].guid;
						output += '", "name":"' + results2[i].name;
						output += '", "account":"' + results2[i].account;
						output += '", "product":"' + results2[i].product;
						output += '", "isdeleted":' + results2[i].isdeleted;
						output += ', "updateddate":"' + results2[i].updateddate.replace(" ", "T") + '"},';
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
					for(var i = 0 ; i < results2.length ; i++)
					{
						output.data.push({"id": results2[i].guid, "name": results2[i].name, "account": results2[i].account,
								  "product": results2[i].product, "predict" : results2[i].predict, "isdeleted": results2[i].isdeleted, 
								  "updateddate": results2[i].updateddate.replace(" ", "T") + "+07:00" });
					}
					res.json(output);
				}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }'); })
			} else { res.status(887).send('{ "success": false, "errorcode" :"02", "errormessage":"No Account" }'); }
		}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }'); })
	}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"00", "errormessage":"Authen Fail." }'); })
};
