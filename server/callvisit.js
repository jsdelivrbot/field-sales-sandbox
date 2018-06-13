var db = require('./pghelper');

exports.createCallVisit = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);

	var query = "INSERT INTO salesforce.call_visit__c ( sfid, Name, Account__c, Salesman__c, Plan_Start__c, ";
	query += "Plan_End__c, Call_Type__c, Comment__c, createddate, systemmodstamp, ";
	query += "IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.name + "', '" + req.body.account + "', '" + req.body.salesman + "', '";
	query += req.body.start + "', '" + req.body.end + "', '" + req.body.calltype + "', '";
	query += req.body.comment + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.updateCallVisit = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);

	var query = "UPDATE salesforce.call_visit__c SET ";
	query += "Name = '" + req.body.name + "', ";
	query += "Account__c = '" + req.body.account + "', ";
	query += "Salesman__c = '" + req.body.salesman + "', ";
	query += "Plan_Start__c = '" + req.body.start + "', ";
	query += "Plan_End__c = '" + req.body.end + "', ";
	query += "Call_Type__c = '" + req.body.calltype + "', ";
	query += "Comment__c = '" + req.body.comment + "', ";
	//query += "Check_In_Time__c = '" + req.body.date + "', ";
	//query += "Check_In_Location__Latitude__s = '" + req.body.date + "', ";
	//query += "Check_In_Location__Longitude__s = '" + req.body.date + "', ";
	//query += "Check_Out_Time__c = '" + req.body.date + "', ";
	//query += "Check_Out_Location__Latitude__s = '" + req.body.date + "', ";
	//query += "Check_Out_Location__Longitude__s = '" + req.body.date + "', ";
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

exports.deleteCallVisit = function(req, res, next) {
	var id = req.params.id;
	//var query = "DELETE FROM salesforce.call_visit__c WHERE sfid = '" + id + "'";	
	var query = "UPDATE salesforce.call_visit__c SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid ='" + id + "'"; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
