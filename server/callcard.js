var db = require('./pghelper');
var auth = require('./auth0');
var sf = require('./salesforce');

exports.createCallCard = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	
	var query = "INSERT INTO salesforce.call_card__c ( sfid, guid, Name, call_visit__c, product__c, ";
	query += "quantity_box__c, quantity_piece__c, remark__c, ";
	query += "createddate, systemmodstamp, IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.sfid + "', '" + req.body.name + "', '" + req.body.visit + "', '";
	query += req.body.product + "', " + req.body.quantitybox + ", " + req.body.quantitypiece + ", '" + req.body.remark + "', ";
	query += "CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.createCallCardList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	
	var query = "INSERT INTO salesforce.call_card__c ( sfid, guid, Name, call_visit__c, product__c, ";
	query += "quantity_box__c, quantity_piece__c, remark__c, ";
	query += "createddate, systemmodstamp, IsDeleted ) VALUES ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].sfid + "', '" + req.body[i].name + "', '" + req.body[i].visit + "', '";
		query += req.body[i].product + "', " + req.body[i].quantitybox + ", " + req.body[i].quantitypiece + ", '" + req.body[i].remark + "', ";
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

exports.updateCallCard = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);

	var query = "UPDATE salesforce.call_card__c SET ";
	query += "call_visit__c = '" + req.body.visit + "', ";
	query += "product__c = '" + req.body.product + "', ";
	query += "quantity_box__c = " + req.body.quantitybox + ", ";
	query += "quantity_piece__c = " + req.body.quantitypiece + ", ";
	query += "remark__c = '" + req.body.remark + "', ";
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

exports.updateCallCardList = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);

	var query = "UPDATE salesforce.call_card__c as o SET ";
	query += "call_visit__c = d.call_visit__c, product__c = d.product__c, quantity_box__c = d.quantity_box__c, ";
	query += "quantity_piece__c = d.quantity_piece__c, remark__c = d.remark__c, ";
	query += "systemmodstamp = CURRENT_TIMESTAMP from (values ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].visit + "', '";
		query += req.body[i].product + "', " + req.body[i].quantitybox + ", ";
		query += req.body[i].quantitypiece + ", '" + req.body[i].remark + "' ";
		query += "), ";
	}
	if(req.body.length > 0)
	{
		query = query.substr(0, query.length - 2);
		query += ") as d(sfid, call_visit__c, product__c, quantity_box__c, quantity_piece__c, remark__c ";
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

exports.deleteCallCard = function(req, res, next) {
	var id = req.params.id;
	//var query = "DELETE FROM salesforce.call_card__c WHERE sfid = '" + id + "'";	
	var query = "UPDATE salesforce.call_card__c SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid ='" + id + "'"; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.deleteCallCardList = function(req, res, next) {
	var cardList = "(";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		cardList += "'" + req.body[i].sfid + "', ";
	}
	cardList = cardList.substr(0, cardList.length - 2);
	cardList += ")";
	//var query = "DELETE FROM salesforce.call_card__c WHERE sfid IN " + cardList";	
	var query = "UPDATE salesforce.call_card__c SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid IN " + cardList; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
