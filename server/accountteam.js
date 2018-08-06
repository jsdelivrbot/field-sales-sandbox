var db = require('./pghelper');

exports.createAccountTeam = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	if (req.body.division == null) return res.send('{ \"status\": "fail", \"message\": "No Pricebook" }');

	var query = "INSERT INTO salesforce.account_team__c ( sfid, account__c, salesman__c, division2__c createddate, systemmodstamp, ";
	query += "IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.account + "', '" + req.body.sales + "', '" + req.body.division;
	query += "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.createAccountTeamList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);

	var haveRecord = false;
	var query = "INSERT INTO salesforce.account_team__c ( sfid, account__c, salesman__c, division2__c, createddate, systemmodstamp, ";
	query += "IsDeleted ) VALUES ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		if(req.body[i].division)
		{
			query += "('" + req.body[i].sfid + "', '" + req.body[i].account + "', '" + req.body[i].sales + "', '" + req.body[i].division;
			query += "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false), ";
			haveRecord = true;
		}
	}
	if(haveRecord == true)
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

exports.deleteAccountTeamList = function(req, res, next) {
 	var teamList = "(";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		teamList += "'" + req.body[i].sfid + "', ";
	}
	teamList = teamList.substr(0, teamList.length - 2);
	teamList += ")";
	//var query = "DELETE FROM salesforce.account_team__c WHERE sfid IN " + teamList;	
	var query = "UPDATE salesforce.account_team__c SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid IN " + teamList;
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
