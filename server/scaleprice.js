var db = require('./pghelper');

exports.createSalesPrice = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	
	var query = "INSERT INTO salesforce.scale_price__c ( sfid, guid, Name, Pricebook_Entry__c, list_price__c, normal_discount__c, ";
	query += "LTP__c, Quantity__c, Discount__c, Net_Price__c, FOC__c, ";
	query += "createddate, systemmodstamp, IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.sfid + "', '" + req.body.name + "', '" + req.body.pricebookentry + "', ";
	query += req.body.listprice + ", " + req.body.normaldiscount + ", " + req.body.ltp + ", " + req.body.quantity + ", ";
	query += req.body.discount + ", " + req.body.netprice + ", " + req.body.foc + ", "; 
	query += "CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.createSalesPriceList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	
	var query = "INSERT INTO salesforce.scale_price__c ( sfid, guid, Name, Pricebook_Entry__c, list_price__c, normal_discount__c, ";
	query += "LTP__c, Quantity__c, Discount__c, Net_Price__c, FOC__c, ";
	query += "createddate, systemmodstamp, IsDeleted ) VALUES ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].sfid + "', '" + req.body[i].name + "', '";
		query += req.body[i].pricebookentry + "', " + req.body[i].listprice + ", " + req.body[i].normaldiscount + ", ";
		query += req.body[i].ltp + ", " + req.body[i].quantity + ", " + req.body[i].discount + ", ";
		query += req.body[i].netprice + ", " + req.body[i].foc + ", "; 
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
	query += "Net_Price__c = " + req.body.netprice + ", ";
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

exports.updateSalesPriceList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
  
	var query = "UPDATE salesforce.scale_price__c as o SET ";
	query += "Name = '" + req.body.name + "', ";
	query += "Pricebook_Entry__c = '" + req.body.pricebookentry + "', ";
	query += "list_price__c = " + req.body.listprice + ", ";
	query += "normal_discount__c = " + req.body.normaldiscount + ", ";
	query += "LTP__c = " + req.body.ltp + ", ";
	query += "Quantity__c = " + req.body.quantity + ", ";
	query += "Discount__c = " + req.body.discount + ", ";
	query += "Net_Price__c = " + req.body.netprice + ", ";
	query += "FOC__c = " + req.body.foc + ", ";	
	query += "systemmodstamp = CURRENT_TIMESTAMP from (values ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].name + "', '" + req.body[i].pricebookentry + "', ";
		query += req.body[i].listprice + ", " + req.body[i].normaldiscount + ", " + req.body[i].ltp + ", ";
		query += req.body[i].quantity + ", " + req.body[i].discount + ", " + req.body[i].netprice + ", ";
		query += req.body[i].foc + " ";
		query += "), ";
	}
	if(req.body.length > 0)
	{
		query = query.substr(0, query.length - 2);
		query += ") as d(sfid, Name, Pricebook_Entry__c, list_price__c, normal_discount__c, LTP__c, Quantity__c, ";
		query += "Discount__c, Net_Price__c, FOC__c ) WHERE o.sfid = d.sfid";
		console.log(query);

		db.select(query)
		.then(function(results) {
			res.send('{ \"status\": "success" }');
		})
		.catch(next);
	}
	else { res.send('{ \"status\": "no data" }'); }
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

exports.deleteSalesPriceList = function(req, res, next) {
	var scaleList = "(";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		scaleList += "'" + req.body[i].sfid + "', ";
	}
	scaleList = scaleList.substr(0, scaleList.length - 2);
	scaleList += ")";
  	//var query = "DELETE FROM salesforce.scale_price__c WHERE sfid IN " + scaleList;	
	var query = "UPDATE salesforce.scale_price__c SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid IN " + scaleList; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
