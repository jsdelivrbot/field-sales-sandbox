var db = require('./pghelper');

exports.createAccountTeam = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);

	var query = "INSERT INTO salesforce.account_team__c ( sfid, account__c, salesman__c, createddate, systemmodstamp, ";
	query += "IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.account + "', '" + req.body.sales + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.deleteAccountTeam = function(req, res, next) {
 	var id = req.params.id;
	//var query = "DELETE FROM salesforce.account_team__c WHERE sfid = '" + id + "'";	
	var query = "UPDATE salesforce.account_team__c SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid = '" + id + "'";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
