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
				
				var contactlist = "(";
				for(var i = 0 ; i < req.body.data.length ; i++)
				{
					if(req.body.data[i].GUID != null)
						contactlist += "'" + req.body.data[i].GUID + "', ";
				}
				contactlist = contactlist.substr(0, contactlist.length - 2);
				contactlist += ")";
				
				var query2 = "SELECT guid, Firstname, Lastname, Nickname__c, Department, Title as Position, ";
				query2 += "Phone, Mobilephone as Mobile, Email, AccountId as Account, IsDeleted, success as Success, ";
				query2 += "errorcode as ErrorCode, errormessage as ErrorMessage, systemmodstamp as UpdatedDate ";
				query2 += "FROM salesforce.Contact WHERE (accountId IN " + accountList + " and ";
				query2 += "systemmodstamp > '" + lastsync2 + "') or guid IN " + contactlist;
				db.select(query2)
				.then(function(results2) {
				      	var output = buildResponse(req.body.data, results2, lastsync, next)
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
				var updateddate = new Date(update[j].updateddate);
				console.log("========" + update[j].updateddate + "========");
				console.log("========" + updateddate + "========");
				console.log("========" + new Date("2018-08-01 08:30:00") + "========");
				console.log("========" + response[i].updateddate + "========");
				console.log("========" + (updateddate > response[i].updateddate) + "========");
				if(updateddate > response[i].updateddate)
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
			var query = "INSERT INTO salesforce.Contact ( guid, ";
			if(update[0].Firstname != null) query += "FirstName, ";
			if(update[0].Lastname != null) query += "LastName, ";
			if(update[0].Nickanme != null) query += "Nickname__c, ";
			if(update[0].Phone != null) query += "Phone, ";
			if(update[0].Position != null) query += "Title, ";
			if(update[0].Email != null) query += "Email, ";
			if(update[0].Department != null) query += "Department, ";
			if(update[0].Account != null) query += "AccountId, ";
			query += "createddate, systemmodstamp, IsDeleted, sync_status ) VALUES ('";
			query += update[0].GUID + "',";
			if(update[0].Firstname != null) query += " '" + update[0].Firstname + "',";
			if(update[0].Lastname != null) query += " '" + update[0].Lastname + "',";
			if(update[0].Nickanme != null) query += " '" + update[0].Nickanme + "',";
			if(update[0].Phone != null) query += " '" + update[0].Phone + "',";
			if(update[0].Position != null) query += " '" + update[0].Position + "',";
			if(update[0].Email != null) query += " '" + update[0].Email + "',";
			if(update[0].Department != null) query += " '" + update[0].Department + "',";
			if(update[0].Account != null) query += " '" + update[0].Account + "', ";
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
			var query = "UPDATE salesforce.Contact SET ";
			if(update[0].Account != null) query += "AccountId = '" + update[0].Account + "', ";
			if(update[0].Firstname != null) query += "Firstname = '" + update[0].Firstname + "', ";
			if(update[0].Lastname != null) query += "Lastname = '" + update[0].Lastname + "', ";
			if(update[0].Nickanme != null) query += "Nickname__c = '" + update[0].Nickanme + "', ";
			if(update[0].Phone != null) query += "Phone = '" + update[0].Phone + "', ";
			if(update[0].Position != null) query += "Title = '" + update[0].Position + "', ";
			if(update[0].Email != null) query += "Email = '" + update[0].Email + "', ";
			if(update[0].Department != null) query += "Department = '" + update[0].Department + "', ";
			if(update[0].Mobile != null) query += "Mobilephone = '" + update[0].Mobile + "', ";
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
