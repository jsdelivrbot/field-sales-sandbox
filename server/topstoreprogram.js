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

exports.createTopStoreList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);

	var query = "INSERT INTO salesforce.Top_Store_Program__c ( sfid, guid, Name, Account__c, Date__c, Event_Type__c, ";
	query += "createddate, systemmodstamp, IsDeleted ) VALUES ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].sfid + "', '" + req.body[i].name + "', ";
		query += (req.body[i].account != null ? "'" + req.body[i].account + "'" : "null") + ", '" + req.body[i].date + "', '";
		query += req.body[i].type + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false), ";
	}
	if(req.body.length > 0 )
	{
		query = query.substr(0, query.length - 2);
		console.log(query);

		db.select(query)
		.then(function(results) {
			res.send('{ \"status\": "success" }');
		})
		.catch(next);
	}
	else { res.send('{ \"status\": "no data" }'); }
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

exports.updateTopStoreList = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);

	var query = "UPDATE salesforce.Top_Store_Program__c as o SET ";
	query += "Name = d.Name, Account__c = d.Account__c, Date__c = d.Date__c, Event_Type__c = d.Event_Type__c, ";
	query += "systemmodstamp = CURRENT_TIMESTAMP from (values ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].name + "', ";
		query += (req.body[i].account != null ? "'" + req.body[i].account + "'" : "null") + ", '" + req.body[i].date + "', '";
		query += req.body[i].type + "' ";
		query += "), ";
	}
	if(req.body.length > 0)
	{
		query = query.substr(0, query.length - 2);
		query += ") as d(sfid, Name, Account__c, Date__c, Event_Type__c ";
		query += ") WHERE o.sfid = d.sfid";
		console.log(query);

		db.select(query)
		.then(function(results) {
			res.send('{ \"status\": "success" }');
		})
		.catch(next);
	}
	else { res.send('{ \"status\": "no data" }'); }
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

exports.deleteTopStoreList = function(req, res, next) {
	var programList = "(";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		programList += "'" + req.body[i].sfid + "', ";
	}
	programList = programList.substr(0, programList.length - 2);
	programList += ")";
	//var query = "DELETE FROM salesforce.Top_Store_Program__c WHERE sfid IN " + programList;	
	var query = "UPDATE salesforce.Top_Store_Program__c SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid IN " + programList; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
