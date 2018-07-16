var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.sync = function(req, res, next) {
	var head = req.headers['authorization'];
	var lastsync = req.body.syncdate;
	var lastsync2 = req.body.syncdate;
	lastsync = new Date(lastsync)
	
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
				
				var programlist = "(";
				for(var i = 0 ; i < req.body.data.length ; i++)
				{
					if(req.body.data[i].id != null)
						programlist += "'" + req.body.data[i].id + "', ";
				}
				programlist = programlist.substr(0, programlist.length - 2);
				programlist += ")";
				
				var query2 = "SELECT guid as Id, name, account__c as account, ";
				query2 += "to_char( date__c + interval '7 hour', 'YYYY-MM-DD') as date, event_type__c as type, ";
				query2 += "success as Success, errorcode as ErrorCode, errormessage as ErrorMessage, ";
				query2 += "to_char( systemmodstamp + interval '7 hour', 'YYYY-MM-DD HH24:MI:SS') as updatedate , isdeleted "
				query2 += "from salesforce.Top_Store_Program__c where (account__c IN " + accountList + " and ";
				query2 += "systemmodstamp > '" + lastsync2 + "') or guid IN " + programlist;
				db.select(query2)
				.then(function(results2) {
					var output = buildResponse(req.body.data, results2, lastsync, next);
					output = { "success": true, "errorcode" : "", "errormessage" : "", "data": output };
					//res.send("Finish!!");
					console.log(output);
					res.json(output);
				}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }'); })
			}
		}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }'); })
	}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"00", "errormessage":"Authen Fail." }'); })
};