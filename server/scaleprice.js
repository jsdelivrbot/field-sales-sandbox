var db = require('./pghelper');

exports.createSalesPrice = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	
	var query = "INSERT INTO salesforce.scale_price__c ( sfid, guid, Name, Pricebook_Entry__c, list_price__c, normal_discount__c, ";
	query += "LTP__c, Quantity__c, Discount__c, Net_Price__c, FOC__c, ";
	query += "createddate, systemmodstamp, IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.sfid + "', '" + req.body.name + "', '" + req.body.pricebookentry + "', ";
	query += req.body.listprice + ", " + req.body.normaldiscount + ", " + req.body.ltp + ", " + req.body.quantity + ", ";
	query += req.body.discount + ", " + req.body.netprice + ", " + req.body.foc + ", "; 
	query += ", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.updateSalesPrice = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);
  
	var query = "UPDATE salesforce.scale_price__c SET ";
	query += "Name = '" + req.body.name + "', ";
	query += "Pricebook_Entry__c = '" + req.body.pricebookentry + "', ";
	query += "list_price__c = " + req.body.listprice + ", ";
	query += "normal_discount__c = " + req.body.normaldiscount + ", ";
	query += "LTP__c = " + req.body.ltp + ", ";
	query += "Quantity__c = " + req.body.quantity + ", ";
	query += "Discount__c = " + req.body.discount + ", ";
	query += "Net_Price__c = " + req.body.ntprice + ", ";
	query += "FOC__c = " + req.body.foc + ", ";	
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

exports.deleteSalesPrice = function(req, res, next) {
	var id = req.params.id;
  //var query = "DELETE FROM salesforce.scale_price__c WHERE sfid = '" + id + "'";	
	var query = "UPDATE salesforce.scale_price__c SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid ='" + id + "'"; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
