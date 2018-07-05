var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.sync = function(req, res, next) {
	var head = req.headers['authorization'];
	var lastsync = req.headers['lastsync'];
	var lastsync2 = req.headers['lastsync'];
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
				
				var query2 = "SELECT guid, name, account__c, date__c, event_type__c, systemmodstamp, isdeleted "
				query2 += "from salesforce.Top_Store_Program__c where account__c IN " + accountList + " and ";
				query2 += "systemmodstamp > '" + lastsync2 + "'";
				db.select(query2)
				.then(function(results2) {
					var output = buildResponse(req.body, results2, lastsync, next)
					//res.send("Finish!!");
					console.log(output);
					res.json(output);
				}) 
				.catch(next);
			}
		}) 
		.catch(next);
	}, function(err) { res.status(887).send("{ \"status\": \"fail\" }"); })
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
			if(update[j].GUID == response[i].guid)
			{
				found = true;
				if(syncdate > response[i].systemmodstamp)
				{
					isInsert = false;
				}
				response.splice(i, 1);
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
			if(update[0].Name != null) query += "name, ";
			if(update[0].Account != null) query += "account__c, ";
			if(update[0].Date != null) query += "date__c, ";
			if(update[0].Type != null) query += "event_type__c, ";
			query += "createddate, systemmodstamp, IsDeleted, sync_status ) VALUES ('";
			query += update[0].GUID + "',";
			if(update[0].Name != null) query += " '" + update[0].Name + "',";
			if(update[0].Account != null) query += " '" + update[0].Account + "',";
			if(update[0].Date != null) query += " '" + update[0].Date + "',";
			if(update[0].Type != null) query += " '" + update[0].Type + "',";
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
			if(update[0].Name != null) query += "name = '" + update[0].Name + "', ";
			if(update[0].Account != null) query += "account__c = '" + update[0].Account + "', ";
			if(update[0].Date != null) query += "date__c = '" + update[0].Date + "', ";
			if(update[0].Type != null) query += "event_type__c = '" + update[0].Type + "', ";
			if(update[0].IsDeleted != null) query += "Isdeleted = '" + update[0].IsDeleted +"', ";
			query += "systemmodstamp = CURRENT_TIMESTAMP, ";
			query += "sync_status = 'Mobile' ";
			query += "WHERE guid = '" + update[0].GUID + "'";

			db.select(query)
			.then(function(results) {
				update.shift();
				action.shift();
				syncDB(update, action, next);
			})
			.catch(next);
		}	
	}
};
