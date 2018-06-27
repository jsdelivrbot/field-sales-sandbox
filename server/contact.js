var db = require('./pghelper');
var sf = require('./salesforce');
var auth = require('./auth0');

exports.createContact = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);

	var query = "INSERT INTO salesforce.Contact ( sfid, FirstName, LastName, Title, Nickname__c, Phone, Fax, Email, ";
	query += "Department, Birthdate, MailingCity, MailingCountry, MailingLatitude, MailingLongitude, MailingPostalCode, ";
	query += "MailingState, MailingStreet, MobilePhone, AccountId, Name, createddate, systemmodstamp, ";
	query += "IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.firstname + "', '" + req.body.lastname + "', '" + req.body.title + "', '";
	query += req.body.nicknane + "', '" + req.body.phone + "', '" + req.body.fax + "', '" + req.body.email + "', '";
	query += req.body.department + "', '" + req.body.birthday + "', '" + req.body.city + "', '" + req.body.country + "', '";
	query += req.body.latitude + "', '" + req.body.longitude + "', '" + req.body.postalcode + "', '" + req.body.state + "', '";
	query += req.body.street + "', '" + req.body.phone + "', '" + req.body.account + "', '" + req.body.firstname + " ";
	query += req.body.lastname + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.updateContact = function(req, res, next) {
    	var id = req.params.id;
    	if (!req.body) return res.sendStatus(400);
  
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
	query += "WHERE sfid = '" + id + "'";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.deleteContact = function(req, res, next) {
  	var id = req.params.id;
	//var query = "DELETE FROM salesforce.Contact WHERE sfid = '" + id + "'";	
	var query = "UPDATE salesforce.Contact SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid ='" + id + "'"; 
	console.log(query);
	
	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.createContact2 = function(req, res, next) {
	var head = req.headers['authorization'];
	if (!req.body) return res.sendStatus(400);

	auth.authen(head)
	.then(function(results) {
		console.log(results.nickname);
		sf.authen()
		.then(function(results2) {
			sf.createContact(req.body, results2.token_type + ' ' + results2.access_token)
			.then(function(results3) {
				var query = "INSERT INTO salesforce.Contact ( sfid, Firstname, Lastname, Title, Nickname__c, Phone, Fax, Email, ";
				query += "Department, Birthdate, MailingCity, MailingCountry, MailingPostalCode, ";
				query += "MailingState, MailingStreet, MobilePhone, AccountId, Name, createddate, systemmodstamp, ";
				query += "IsDeleted ) VALUES ('";
				query += results3.id + "', '" + req.body.Firstname + "', '" + req.body.Lastname + "', '" + req.body.Title + "', '";
				query += req.body.Nickname__c + "', '" + req.body.Phone + "', '" + req.body.Fax + "', '" + req.body.Email + "', '";
				query += req.body.Department + "', '" + req.body.Birthdate + "', '" + req.body.MailingCity + "', '" + req.body.MailingCountry + "', '";
				query += req.body.MailingPostalCode + "', '" + req.body.MailingState + "', '";
				query += req.body.MailingStreet + "', '" + req.body.MobilePhone + "', '" + req.body.AccountId + "', '" + req.body.Firstname + " ";
				query += req.body.Lastname + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
				console.log(query);

				db.select(query)
				.then(function(results) {
					res.send('{ \"status\": "success" }');
				})
				.catch(next);
			})
			.catch(next);
		})
		.catch(next);
	}, function(err) { res.status(887).send("{ \"status\": \"fail\" }"); })	
};

exports.updateContact2 = function(req, res, next) {
    	var id = req.params.id;
	var head = req.headers['authorization'];
    	if (!req.body) return res.sendStatus(400);
  	
	auth.authen(head)
	.then(function(results) {
		console.log(results.nickname);
		sf.authen()
		.then(function(results2) {
			sf.updateContact(id, req.body, results2.token_type + ' ' + results2.access_token)
			.then(function(results3) {
				
				var query = "UPDATE salesforce.Contact SET ";
				if(req.body.AccountId != null) query += "AccountId = '" + req.body.AccountId + "', ";
				if(req.body.FirstName != null && req.body.LastName != null) 
					query += "Name = '" + req.body.FirstName + " " + req.body.LastName + "', ";
				if(req.body.FirstName != null) query += "FirstName = '" + req.body.FirstName + "', ";
				if(req.body.LastName != null) query += "LastName = '" + req.body.LastName + "', ";
				if(req.body.Title != null) query += "Title = '" + req.body.Title + "', ";
				if(req.body.Nickname__c != null) query += "Nickname__c = '" + req.body.Nickname__c + "', ";
				if(req.body.Phone != null) query += "Phone = '" + req.body.Phone + "', ";
				if(req.body.Fax != null) query += "Fax = '" + req.body.Fax + "', ";
				if(req.body.Email != null) query += "Email = '" + req.body.Email + "', ";
				if(req.body.Department != null) query += "Department = '" + req.body.Department + "', ";
				if(req.body.Birthdate != null) query += "Birthdate = '" + req.body.Birthdate + "', ";
				if(req.body.MailingCity != null) query += "MailingCity = '" + req.body.MailingCity + "', ";
				if(req.body.MailingCountry != null) query += "MailingCountry = '" + req.body.MailingCountry + "', ";
				if(req.body.MailingPostalCode != null) query += "MailingPostalCode = '" + req.body.MailingPostalCode + "', ";
				if(req.body.MailingState != null) query += "MailingState = '" + req.body.MailingState + "', ";
				if(req.body.MailingStreet != null) query += "MailingStreet = '" + req.body.MailingStreet + "', ";
				if(req.body.MobilePhone != null) query += "MobilePhone = '" + req.body.MobilePhone + "', ";
				query += "systemmodstamp = CURRENT_TIMESTAMP ";
				query += "WHERE sfid = '" + id + "'";
				console.log(query);

				db.select(query)
				.then(function(results) {
					res.send('{ \"status\": "success" }');
				})
				.catch(next);
				
				//res.send('{ \"status\": "success" }');
			})
			.catch(next);
		})
		.catch(next);
	}, function(err) { res.status(887).send("{ \"status\": \"fail\" }"); })	
};
