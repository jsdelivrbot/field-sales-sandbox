var db = require('./pghelper');

exports.createInvoice = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	
	var query = "INSERT INTO salesforce.invoice__c ( sfid, guid, Name, Bill_To__c, Ship_To__c, Billing_Type__c, ";
	query += "Billing_Date__c, Customer_PO_No__c, Delivery_Order__c, Inco_Term__c, Payment_Term__c, Sales_Man__c, ";
	query += "Sales_Order__c, VAT__c, Order__c, Sub_Total__c, createddate, systemmodstamp, ";
	query += "IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.sfid + "', '" + req.body.name + "', ";
	
	if (req.body.billto != null) {
		query += "'" + req.body.billto + "', ";
	} else {
		query += req.body.billto + ", ";
	}
	
	if (req.body.shipto != null) {
		query += "'" + req.body.shipto + "', '";
	} else {
		query += req.body.shipto + ", '";
	}
	
	query += req.body.billtype + "', '" + req.body.date + "', '" + req.body.po + "', '" + req.body.do + "', '";
	query += req.body.inco + "', '" + req.body.payment + "', "
	
	if (req.body.salesman != null) {
		query += "'" + req.body.salesman + "', '";
	} else {
		query += req.body.salesman + ", '";
	}
	
	query += req.body.so + "', '";
	query += req.body.vat + "', "
	
	if (req.body.order != null) {
		query += "'" + req.body.order + "', '";
	} else {
		query += req.body.order + ", '";
	}
	
	query += req.body.total +"', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.updateInvoice = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);
  	
	if (req.body.order == null) {
		req.body.order = NULL;
	}

	if (req.body.billto == null) {
		req.body.billto = NULL;
	}

	if (req.body.shipto == null) {
		req.body.shipto = NULL;
	}

	if (req.body.salesman == null) {
		req.body.salesman = NULL;
	}
	
	var query = "UPDATE salesforce.invoice__c SET ";
	query += "Name = '" + req.body.name + "', ";
	query += "Bill_To__c = '" + req.body.billto + "', ";
	query += "Order__c = '" + req.body.order + "', ";
	query += "Ship_To__c = '" + req.body.shipto + "', ";
	query += "Billing_Type__c = '" + req.body.billtype + "', ";
	query += "Billing_Date__c = '" + req.body.date + "', ";
	query += "Customer_PO_No__c = '" + req.body.po + "', ";
	query += "Delivery_Order__c = '" + req.body.do + "', ";
	query += "Inco_Term__c = '" + req.body.inco + "', ";
	query += "Payment_Term__c = '" + req.body.playment + "', ";
	query += "Sales_Man__c = '" + req.body.salesman + "', ";
	query += "Sales_Order__c = '" + req.body.so + "', ";
	query += "VAT__c = '" + req.body.vat + "', ";
	query += "Sub_Total__c = '" + req.body.total + "', ";
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

exports.deleteInvoice = function(req, res, next) {
	var id = req.params.id;
	//var query = "DELETE FROM salesforce.invoice__c WHERE sfid = '" + id + "'";	
	var query = "UPDATE salesforce.invoice__c SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid ='" + id + "'"; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
