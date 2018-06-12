var db = require('./pghelper');

exports.createPricebookentry = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);

	var query = "INSERT INTO salesforce.pricebook_entry__c ( sfid, Name, Product__c, Price_Book__c, ";
	query += "IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.name + "', '" + req.body.product + "', '";
	query += req.body.pricebook + "', false)";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.updatePricebookentry = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);
  
	var query = "UPDATE salesforce.pricebook_entry__c SET ";
	query += "Name = '" + req.body.name + "', ";
	query += "Product__c = '" + req.body.account + "', ";
	query += "Price_Book__c = '" + req.body.date + "', ";
	query += "Isdeleted = '" + req.body.isdeleted +"' ";
	query += "WHERE sfid = '" + id + "'";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.deletePricebookentry = function(req, res, next) {
	var id = req.params.id;
	//var query = "DELETE FROM salesforce.pricebook_entry__c WHERE sfid = '" + id + "'";	
	var query = "UPDATE salesforce.pricebook_entry__c SET IsDeleted = true WHERE sfid ='" + id + "'"; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
