var db = require('./pghelper');

exports.createReturnList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	
	var query = "INSERT INTO salesforce.good_return__c ( sfid, guid, Name, call_visit__c, product__c, quantity_case__c, ";
	query += "quantity_piece__c, invoice__c, reason__c, ";
	query += "createddate, systemmodstamp, IsDeleted ) VALUES ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].sfid + "', '" + req.body[i].name + "', '";
		query += req.body[i].visit + "', " + req.body[i].product + ", " + req.body[i].quantitycase + ", ";
		query += req.body[i].quantitypiece + ", " + req.body[i].invoice + ", " + req.body[i].reason + ", ";
		query += "CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false), ";
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

exports.updateReturnList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
  
	var query = "UPDATE salesforce.good_return__c as o SET ";
	query += "call_visit__c = d.call_visit__c, product__c = d.product__c, quantity_case__c = d.quantity_case__c, ";
	query += "quantity_piece__c = d.quantity_piece__c, invoice__c = d.invoice__c, reason__c = d.reason__c, visit_guid = null";
	query += "systemmodstamp = CURRENT_TIMESTAMP from (values ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].visit + "', '" + req.body[i].product + "', ";
		query += req.body[i].quantitycase + ", " + req.body[i].quantitypiece + ", '" + req.body[i].invoice + "', '";
		query += req.body[i].reason + "' ";
		query += "), ";
	}
	if(req.body.length > 0)
	{
		query = query.substr(0, query.length - 2);
		query += ") as d(sfid, call_visit__c, product__c, quantity_case__c, quantity_piece__c, invoice__c, reason__c ";
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

exports.deleteReturnList = function(req, res, next) {
	var returnList = "(";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		returnList += "'" + req.body[i].sfid + "', ";
	}
	returnList = returnList.substr(0, returnList.length - 2);
	returnList += ")";
  	//var query = "DELETE FROM salesforce.good_return__c WHERE sfid IN " + returnList;	
	var query = "UPDATE salesforce.good_return__c SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid IN " + returnList; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
