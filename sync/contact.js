var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.sync = function(req, res, next) {
	var head = req.headers['authorization'];
	var lastsync = req.headers['lastsync'];
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
				
				var query2 = "SELECT guid, Firstname, Lastname, Nickname__c, Department, Title as Position, ";
				query2 += "Phone, Mobilephone as Mobile, Email, AccountId as Account, systemmodstamp ";
				query2 += "FROM salesforce.Contact WHERE accountId IN " + accountList;
				db.select(query2)
				.then(function(results2) {
				      	var output = syncDB(req.body, results2, lastsync, next);
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

function syncDB(update, response, syncdate, next)
{
	if(update.length > 0)
	{
		var isInsert = true;
		for(var i = 0 ; i < response.length && isInsert; i++)
		{
			//console.log("update[0].GUID = " + update[0].GUID + ", response[i].guid = " + response[i].guid);
			//console.log("update[0].GUID == response[i].guid " + (update[0].GUID == response[i].guid));
			//console.log("syncdate = " + syncdate + ", response[i].systemmodstamp = " + response[i].systemmodstamp);
			//console.log("syncdate > response[i].systemmodstamp " + (syncdate > response[i].systemmodstamp));
			if(update[0].GUID == response[i].guid && syncdate > response[i].systemmodstamp)
			{
				isInsert = false;
				response.splice(i, 1);
			}
		}
		//console.log(isInsert);
		if(isInsert == true)
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
			query += "createddate, systemmodstamp, IsDeleted ) VALUES ('";
			query += update[0].GUID + "',";
			if(update[0].Firstname != null) query += " '" + update[0].Firstname + "',";
			if(update[0].Lastname != null) query += " '" + update[0].Lastname + "',";
			if(update[0].Nickanme != null) query += " '" + update[0].Nickanme + "',";
			if(update[0].Phone != null) query += " '" + update[0].Phone + "',";
			if(update[0].Position != null) query += " '" + update[0].Position + "',";
			if(update[0].Email != null) query += " '" + update[0].Email + "',";
			if(update[0].Department != null) query += " '" + update[0].Department + "',";
			if(update[0].Account != null) query += " '" + update[0].Account + "', ";
			query += "CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
			/*
			db.select(query)
			.then(function(results) {
				update.shift();
				syncDB(update, response, syncdate, next);
			})
			.catch(next);
			*/
			console.log(query);
		}
		else
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
			query += "systemmodstamp = CURRENT_TIMESTAMP ";
			query += "WHERE guid = '" + update[0].GUID + "'";
			/*
			db.select(query)
			.then(function(results) {
				update.shift();
				syncDB(update, response, syncdate, next);
			})
			.catch(next);
			*/
			console.log(query);
		}
		update.shift();
		syncDB(update, response, syncdate, next);	
	}
	return response;
}
