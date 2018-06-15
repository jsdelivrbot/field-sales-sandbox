var db = require('./pghelper');

exports.createHistory = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);

	var query = "INSERT INTO salesforce.product_History__c ( sfid, Name, Account__c, Product__c, createddate, ";
	query += "systemmodstamp, IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.name + "', '" + req.body.account + "', '" + req.body.product + "', '";
	query += "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.updateHistory = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);
  
	var query = "UPDATE salesforce.product_History__c SET ";
	query += "Name = '" + req.body.name + "', ";
	query += "Account__c = '" + req.body.accpunt + "', ";
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
