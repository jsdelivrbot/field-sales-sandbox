var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.sync = function(req, res, next) {
	var head = req.headers['authorization'];
	var lastsync = req.headers['lastsync'];

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
				
				var query2 = "SELECT * FROM salesforce.Contact WHERE accountId IN " + accountList;
				console.log(query2);
				db.select(query2)
				.then(function(results2) {
				      var output = syncDB(req.body, results2, lastsync);
 				      //res.send("Finish!!");
			              res.json(JSON.parse(output));
				}) 
				.catch(next);
			}
		}) 
		.catch(next);
	}, function(err) { res.status(887).send("{ \"status\": \"fail\" }"); })
};

function syncDB(update, response, syncdate)
{
	if(update.length > 0)
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
			query += update[0].sfid + "', '" + update[0].firstname + "', '" + update[0].lastname + "', '" + update[0].title + "', '";
			query += update[0].nicknane + "', '" + update[0].phone + "', '" + update[0].fax + "', '" + update[0].email + "', '";
			query += update[0].department + "', '" + update[0].birthday + "', '" + update[0].city + "', '" + update[0].country + "', '";
			query += update[0].latitude + "', '" + update.longitude + "', '" + update[0].postalcode + "" + update[0].firstname + " ";
			query += update.lastname + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";', '" + update[0].state + "', '";
			query += update[0].street + "', '" + update[0].phone + "', '" + update[0].account + "', ';
			
			db.select(query)
			.then(function(results) {
				update.shift();
				syncDB(update, response, syncdate);
			})
			.catch(next);
		}
		else
		{
			var query = "UPDATE salesforce.Contact SET ";
			if(update[0].Account != null) query += "AccountId = '" + update[0].Account + "', ";
			if(update[0].Firstname != null && update[0].Lastname != null) 
				query += "Name = '" + update[0].Firstname + " " + update[0].Lastname + "', ";
			if(update[0].Firstname != null) query += "FirstName = '" + update[0].Firstname + "', ";
			if(update[0].Lastname != null) query += "LastName = '" + update[0].Lastname + "', ";
			if(update[0].Title != null) query += "Title = '" + update[0].Title + "', ";
			if(update[0].Nickanme != null) query += "Nickname__c = '" + update[0].Nickanme + "', ";
			if(update[0].phone != null) query += "Phone = '" + update[0].phone + "', ";
			if(update[0].fax != null) query += "Fax = '" + update[0].fax + "', ";
			if(update[0].email != null) query += "Email = '" + update[0].email + "', ";
			if(update[0].department != null) query += "Department = '" + update[0].department + "', ";
			if(update[0].birthdate != null) query += "Birthdate = '" + update[0].birthdate + "', ";
			if(update[0].city != null) query += "MailingCity = '" + update[0].city + "', ";
			if(update[0].country != null) query += "MailingCountry = '" + update[0].country + "', ";
			if(update[0].latitude != null) query += "MailingLatitude = '" + update[0].latitude + "', ";
			if(update[0].longitude != null) query += "MailingLongitude = '" + update[0].longitude + "', ";
			if(update[0].postalcode != null) query += "MailingPostalCode = '" + update[0].postalcode + "', ";
			if(update[0].state != null) query += "MailingState = '" + update[0].state + "', ";
			if(update[0].street != null) query += "MailingStreet = '" + update[0].street + "', ";
			if(update[0].phone != null) query += "MobilePhone = '" + update[0].phone + "', ";
			query += "systemmodstamp = CURRENT_TIMESTAMP, ";
			if(update[0].isdeleted != null) query += "Isdeleted = '" + update[0].isdeleted +"' ";
			query += "WHERE guid = '" + update[0].GUID + "'";
			
			db.select(query)
			.then(function(results) {
				update.shift();
				syncDB(update, response, syncdate);
			})
			.catch(next);
		}
		
	}
	return response;
}
