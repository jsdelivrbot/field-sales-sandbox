var db = require('./pghelper');

exports.createHistory = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);

	var query = "INSERT INTO salesforce.product_History__c ( sfid, guid, Name, Account__c, Product__c, createddate, ";
	query += "systemmodstamp, IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.sfid + "', '" + req.body.name + "', '" + req.body.account + "', '" + req.body.product;
	query += "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.createHistoryList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);

	var query = "INSERT INTO salesforce.product_History__c ( sfid, guid, Name, Account__c, Product__c, createddate, ";
	query += "systemmodstamp, IsDeleted ) VALUES ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].sfid + "', '" + req.body[i].name + "', '";
		query += req.body[i].account + "', '" + req.body[i].product + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false), ";
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

exports.updateHistory = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);
  
	var query = "UPDATE salesforce.product_history__c SET ";
	query += "Name = '" + req.body.name + "', ";
	query += "Account__c = '" + req.body.account + "', ";
	query += "Product__c = '" + req.body.product + "', ";
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

exports.updateHistoryList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
  
	var query = "UPDATE salesforce.product_history__c as o SET ";
	query += "Name = d.Name, ";
	query += "Account__c = d.Account__c, ";
	query += "Product__c = d.Product__c, ";
	query += 'systemmodstamp = CURRENT_TIMESTAMP from (values ';
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].name + "', '" + req.body[i].account + "', '";
		query += req.body[i].product + "' "
		query += "), ";
	}
	if(req.body.length > 0)
	{
		query = query.substr(0, query.length - 2);
		query += ") as d(sfid, Name, Account__c, Product__c ";
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

exports.deleteHistory = function(req, res, next) {
	var id = req.params.id;
  	//var query = "DELETE FROM salesforce.product_History__c WHERE sfid = '" + id + "'";	
	var query = "UPDATE salesforce.product_History__c SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid ='" + id + "'"; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.deleteHistoryList = function(req, res, next) {
	var historyList = "(";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		historyList += "'" + req.body[i].sfid + "', ";
	}
	historyList = historyList.substr(0, historyList.length - 2);
	historyList += ")";
  	//var query = "DELETE FROM salesforce.product_history__c WHERE sfid IN " + historyList;	
	var query = "UPDATE salesforce.product_history__c SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid IN " + historyList; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
