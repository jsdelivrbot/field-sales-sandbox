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
				query2 += "systemmodstamp + interval '7 hour' > '" + lastsync2 + "') or guid IN " + programlist;
				db.select(query2)
				.then(function(results2) {
					for(var i = 0 ; i < results2.length ; i++)
					{
						results2[i].updatedate = results2[i].updatedate.replace(" ", "T");
					}
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

function buildResponse(update, response, syncdate, next)
{
	var action = [];
	for(var j = 0 ; j < update.length ; j++)
	{
		var found = false;
		var isInsert = true;
		for(var i = 0 ; i < response.length && isInsert; i++)
		{
			if(update[j].id == response[i].id )
			{
				found = true;
				var updateddate = new Date(update[j].updateddate);
				if(updateddate > response[i].updatedate)
				{
					isInsert = false;
					response.splice(i, 1);
				}
			}
		}
		if(!found) { action.push("insert"); }
		else if(!isInsert) { action.push("update"); }
		else { action.push("none"); }
	}
	syncDB(update, action, next);
	return response;
};

function syncDB(update, action, next)
{
	if(update.length > 0)
	{
		if(action[0] == "insert")
		{
			var query = "INSERT INTO salesforce.Top_Store_Program__c ( guid, ";
			if(update[0].name != null) query += "name, ";
			if(update[0].account != null) query += "account__c, ";
			if(update[0].date != null) query += "date__c, ";
			if(update[0].type != null) query += "event_type__c, ";
			query += "createddate, systemmodstamp, IsDeleted, sync_status ) VALUES ('";
			query += update[0].id + "',";
			if(update[0].name != null) query += " '" + update[0].name + "',";
			if(update[0].account != null) query += " '" + update[0].account + "',";
			if(update[0].date != null) query += " '" + update[0].date + "',";
			if(update[0].type != null) query += " '" + update[0].type + "',";
			query += "CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'Mobile')";

			db.select(query)
			.then(function(results) {
				update.shift();
				action.shift();
				syncDB(update, action, next);
			})
			.catch(next);
		}
		else if (action[0] == "update")
		{
			var query = "UPDATE salesforce.Top_Store_Program__c SET ";
			if(update[0].name != null) query += "name = '" + update[0].name + "', ";
			if(update[0].account != null) query += "account__c = '" + update[0].account + "', ";
			if(update[0].date != null) query += "date__c = '" + update[0].date + "', ";
			if(update[0].type != null) query += "event_type__c = '" + update[0].type + "', ";
			if(update[0].isdeleted != null) query += "Isdeleted = '" + update[0].isdeleted +"', ";
			query += "systemmodstamp = CURRENT_TIMESTAMP, ";
			query += "sync_status = 'Mobile' ";
			query += "WHERE guid = '" + update[0].id + "'";

			db.select(query)
			.then(function(results) {
				update.shift();
				action.shift();
				syncDB(update, action, next);
			})
			.catch(next);
		}	
		else
		{
			update.shift();
			action.shift();
			syncDB(update, action, sales, next);
		}
	}
};
