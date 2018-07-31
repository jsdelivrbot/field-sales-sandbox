var db = require('./pghelper');

exports.createPricebookentry = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);

	var query = "INSERT INTO salesforce.pricebook_entry__c ( sfid, guid, Name, Product__c, Price_Book__c, group__c createddate, systemmodstamp, ";
	query += "IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.sfid + "', '" + req.body.name + "', '" + req.body.product + "', '";
	query += req.body.pricebook + "', '" + (req.body.group != null ? req.body.group : "") + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.createPricebookentryList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);

	var query = "INSERT INTO salesforce.pricebook_entry__c ( sfid, guid, Name, Product__c, Price_Book__c, group__c, createddate, systemmodstamp, ";
	query += "IsDeleted ) VALUES ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].sfid + "', '" + req.body[i].name + "', '" + req.body[i].product + "', '";
		query += req.body[i].pricebook + "', '" + (req.body[i].group != null ? req.body[i].group : "") + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false), ";
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

exports.updatePricebookentry = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);
  
	var query = "UPDATE salesforce.pricebook_entry__c SET ";
	query += "Name = '" + req.body.name + "', ";
	query += "Product__c = '" + req.body.product + "', ";
	query += "Price_Book__c = '" + req.body.pricrbook + "', ";
	query += "Group__c = '" + (req.body.group != null ? req.body.group : "") + "', ";
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

exports.updatePricebookentryList = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);
  
	var query = "UPDATE salesforce.pricebook_entry__c as o SET ";
	query += "Name = d.Name, Product__c = d.Product__c, Price_Book__c = d.Price_Book__c, Group__c = d.Group__c, ";
	query += "systemmodstamp = CURRENT_TIMESTAMP from (values ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].name + "', '" + req.body[i].product + "', '";
		query += req.body[i].pricebook + "', '" + (req.body[i].group != null ? req.body[i].group : "") + "' ";
		query += "), ";
	}
	if(req.body.length > 0)
	{
		query = query.substr(0, query.length - 2);
		query += ") as d(sfid, Name, Product__c, Price_Book__c, Group__c) WHERE o.sfid = d.sfid";
		console.log(query);

		db.select(query)
		.then(function(results) {
			res.send('{ \"status\": "success" }');
		})
		.catch(next);
	}
	else { res.send('{ \"status\": "no data" }'); }
};

exports.deletePricebookentry = function(req, res, next) {
	var id = req.params.id;
	//var query = "DELETE FROM salesforce.pricebook_entry__c WHERE sfid = '" + id + "'";	
	var query = "UPDATE salesforce.pricebook_entry__c SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid ='" + id + "'"; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.deletePricebookentryList = function(req, res, next) {
	var entryList = "(";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		entryList += "'" + req.body[i].sfid + "', ";
	}
	entryList = entryList.substr(0, entryList.length - 2);
	entryList += ")";
	//var query = "DELETE FROM salesforce.pricebook_entry__c WHERE sfid IN " + entryList;	
	var query = "UPDATE salesforce.pricebook_entry__c SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid IN " + entryList; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
