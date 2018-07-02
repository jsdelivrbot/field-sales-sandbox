var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.sync = function(req, res, next) {
	var head = req.headers['authorization'];
	var lastsync = req.headers['lastsync'];

	auth.authen(head)
	.then(function(obj) {
		var sales = obj.nickname;
		var query = "SELECT * FROM salesforce.Account WHERE sfid IN ";
		query += "(SELECT account__c FROM salesforce.account_team__c WHERE LOWER(salesman__c) = '" + sales + "'";
		query += " by accountnumber asc";
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
				
				var query2 = "SELECT * FROM salesforce.Contact WHERE accountId IN " + accountList;
				console.log(query2);
				db.select(query2)
				.then(function(results2) {
				      
				      //res.json(JSON.parse(output));
				      var output = syncDB(res.body, results2, lastsync);
 				      res.send("Finish!!");
				}) 
				.catch(next);
			}
		}) 
		.catch(next);
	}, function(err) { res.status(887).send("{ \"status\": \"fail\" }"); })
};

function syncDB(update, response, syncdate)
{
	if(update > 0)
	{
		var isInsert = true;
		for(var i = 0 ; i < response.length && isInsert; i++)
		{
			if(update[0].GUID == response[i].guid && syncdate > response[i].systemmodstamp)
			{
				isInsert == false;
				response.splice(i, 1);
			}
		}
		if(isInsert)
		{
			var query = "INSERT INTO salesforce.Contact ( sfid, FirstName, LastName, Title, Nickname__c, Phone, Fax, Email, ";
			query += "Department, Birthdate, MailingCity, MailingCountry, MailingLatitude, MailingLongitude, MailingPostalCode, ";
			query += "MailingState, MailingStreet, MobilePhone, AccountId, Name, createddate, systemmodstamp, ";
			query += "IsDeleted ) VALUES ('";
			query += update[0].sfid + "', '" + update.firstname + "', '" + update.lastname + "', '" + update.title + "', '";
			query += update[0].nicknane + "', '" + update.phone + "', '" + update.fax + "', '" + update.email + "', '";
			query += update[0].department + "', '" + update.birthday + "', '" + update.city + "', '" + update.country + "', '";
			query += update[0].latitude + "', '" + update.longitude + "', '" + update.postalcode + "', '" + update.state + "', '";
			query += update[0].street + "', '" + update.phone + "', '" + update.account + "', '" + update.firstname + " ";
			query += update.lastname + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
			
			console.log(query);
		}
		else
		{
			var query = "UPDATE salesforce.Contact SET ";
			if(req.body.account != null) query += "AccountId = '" + req.body.account + "', ";
			if(req.body.firstname != null && req.body.lastname != null) 
				query += "Name = '" + req.body.firstname + " " + req.body.lastname + "', ";
			if(req.body.firstname != null) query += "FirstName = '" + req.body.firstname + "', ";
			if(req.body.lastname != null) query += "LastName = '" + req.body.lastname + "', ";
			if(req.body.title != null) query += "Title = '" + req.body.title + "', ";
			if(req.body.nickname != null) query += "Nickname__c = '" + req.body.nickname + "', ";
			if(req.body.phone != null) query += "Phone = '" + req.body.phone + "', ";
			if(req.body.fax != null) query += "Fax = '" + req.body.fax + "', ";
			if(req.body.email != null) query += "Email = '" + req.body.email + "', ";
			if(req.body.department != null) query += "Department = '" + req.body.department + "', ";
			if(req.body.birthdate != null) query += "Birthdate = '" + req.body.birthdate + "', ";
			if(req.body.city != null) query += "MailingCity = '" + req.body.city + "', ";
			if(req.body.country != null) query += "MailingCountry = '" + req.body.country + "', ";
			if(req.body.latitude != null) query += "MailingLatitude = '" + req.body.latitude + "', ";
			if(req.body.longitude != null) query += "MailingLongitude = '" + req.body.longitude + "', ";
			if(req.body.postalcode != null) query += "MailingPostalCode = '" + req.body.postalcode + "', ";
			if(req.body.state != null) query += "MailingState = '" + req.body.state + "', ";
			if(req.body.street != null) query += "MailingStreet = '" + req.body.street + "', ";
			if(req.body.phone != null) query += "MobilePhone = '" + req.body.phone + "', ";
			query += "systemmodstamp = CURRENT_TIMESTAMP, ";
			if(req.body.isdeleted != null) query += "Isdeleted = '" + req.body.isdeleted +"' ";
			query += "WHERE guid = '" + update[0].GUID + "'";
			
			console.log(query);
		}
	}
	return response;
}
