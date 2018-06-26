var db = require('./pghelper');

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
	query += "AccountId = '" + req.body.account + "', ";
	query += "Name = '" + req.body.firstname + " " + req.body.lastname + "', ";
	query += "FirstName = '" + req.body.firstname + "', ";
	query += "LastName = '" + req.body.lastname + "', ";
	query += "Title = '" + req.body.title + "', ";
	query += "Nickname__c = '" + req.body.nickname + "', ";
	query += "Phone = '" + req.body.phone + "', ";
	query += "Fax = '" + req.body.fax + "', ";
	query += "Email = '" + req.body.email + "', ";
	query += "Department = '" + req.body.department + "', ";
	query += "Birthdate = '" + req.body.birthdate + "', ";
	query += "MailingCity = '" + req.body.city + "', ";
	query += "MailingCountry = '" + req.body.country + "', ";
	query += "MailingLatitude = '" + req.body.latitude + "', ";
	query += "MailingLongitude = '" + req.body.longitude + "', ";
	query += "MailingPostalCode = '" + req.body.postalcode + "', ";
	query += "MailingState = '" + req.body.state + "', ";
	query += "MailingStreet = '" + req.body.street + "', ";
	query += "MobilePhone = '" + req.body.phone + "', ";
	query += "systemmodstamp = CURRENT_TIMESTAMP, ";
	query += "Isdeleted = '" + req.body.isdeleted +"' ";
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

	var https = require('https');
	var options = {
		host: 'app98692077.auth0.com',
		path: '/userinfo',
		port: '443',
		method: 'GET',
		headers: { 'authorization': head }
	};

	callback = function(results) {
		var str = '';
		results.on('data', function(chunk) {
			str += chunk;
		});
		results.on('end', function() {
			try {
				console.log(str);
				var obj = JSON.parse(str);
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
			}
			catch(ex) { res.status(887).send("{ \"status\": \"fail\" }"); }
		});
	}
			
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();	
};

exports.createContactMobile = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);

	var query = "INSERT INTO salesforce.Contact ( FirstName, LastName, Title, Nickname__c, Phone, Fax, Email, ";
	query += "Department, Birthdate, MailingCity, MailingCountry, MailingLatitude, MailingLongitude, MailingPostalCode, ";
	query += "MailingState, MailingStreet, MobilePhone, AccountId, Name, createddate, systemmodstamp, ";
	query += "IsDeleted ) VALUES ('";
	query += req.body.firstname + "', '" + req.body.lastname + "', '" + req.body.title + "', '";
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
