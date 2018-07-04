var db = require('./pghelper');

exports.createTopStore = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);

	var query = "INSERT INTO salesforce.Top_Store_Program__c ( sfid, guid, Name, Account__c, Date__c, Event_Type__c, ";
	query += "createddate, systemmodstamp, IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.sfid + "', '" + req.body.name + "', '" + req.body.account + "', '" + req.body.date + "', '";
	query += req.body.type + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.updateTopStore = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);

	var query = "UPDATE salesforce.Top_Store_Program__c SET ";
	query += "Name = '" + req.body.name + "', ";
	query += "Account__c = '" + req.body.account + "', ";
	query += "Date__c = '" + req.body.date + "', ";
	query += "Event_Type__c = '" + req.body.type + "', ";
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

exports.deleteTopStore = function(req, res, next) {
	var id = req.params.id;
	//var query = "DELETE FROM salesforce.Top_Store_Program__c WHERE sfid = '" + id + "'";	
	var query = "UPDATE salesforce.Top_Store_Program__c SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid ='" + id + "'"; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
