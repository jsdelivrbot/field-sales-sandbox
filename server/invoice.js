var db = require('./pghelper');

exports.createInvoice = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	
	var query = "INSERT INTO salesforce.invoice__c ( sfid, guid, Name, Bill_To__c, Ship_To__c, Billing_Type__c, ";
	query += "Billing_Date__c, Customer_PO_No__c, Delivery_Order__c, Inco_Term__c, Payment_Term__c, Sales_Man__c, ";
	query += "Sales_Order__c, VAT__c, Order__c, Sub_Total__c, createddate, systemmodstamp, ";
	query += "IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.sfid + "', '" + req.body.name + "', ";
	query += (req.body.billto != null ? "'" + req.body.billto + "'" : "null") + ", ";
	query += (req.body.shipto != null ? "'" + req.body.shipto + "'" : "null") + ", '";
	query += req.body.billtype + "', '" + req.body.date + "', '" + req.body.po + "', '" + req.body.do + "', '";
	query += req.body.inco + "', '" + req.body.payment + "', "
	query += (req.body.salesman != null ? "'" + req.body.salesman + "'" : "null") + ", '";
	query += req.body.so + "', ";
	query += req.body.vat + ", "
	query += (req.body.order != null ? "'" + req.body.order + "'" : "null" ) + ", ";
	query += req.body.total +", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.createInvoiceList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	
	var query = "INSERT INTO salesforce.invoice__c ( sfid, guid, Name, Bill_To__c, Ship_To__c, Billing_Type__c, ";
	query += "Billing_Date__c, Customer_PO_No__c, Delivery_Order__c, Inco_Term__c, Payment_Term__c, Sales_Man__c, ";
	query += "Sales_Order__c, VAT__c, Order__c, Sub_Total__c, createddate, systemmodstamp, ";
	query += "IsDeleted ) VALUES ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].sfid + "', '" + req.body[i].name + "', ";
		query += (req.body[i].billto != null ? "'" + req.body[i].billto + "'" : "null") + ", ";
		query += (req.body[i].shipto != null ? "'" + req.body[i].shipto + "'" : "null") + ", '";
		query += req.body[i].billtype + "', '" + req.body[i].date + "', '" + req.body[i].po + "', '" + req.body[i].do + "', '";
		query += req.body[i].inco + "', '" + req.body[i].payment + "', "
		query += (req.body[i].salesman != null ? "'" + req.body[i].salesman + "'" : "null") + ", '";
		query += req.body[i].so + "', " + req.body[i].vat + ", ";
		query += (req.body[i].order != null ? "'" + req.body[i].order + "'" : "null" ) + ", ";
		query += req.body[i].total +", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false), ";
	}
	if(req.body.length > 0 )
	{
		query = query.substr(0, query.length - 2);
		
		db.select(query)
		.then(function(results) {
			res.send('{ \"status\": "success" }');
		})
		.catch(next);
	}
	else { res.send('{ \"status\": "no data" }'); }
};

exports.updateInvoice = function(req, res, next) {
	var id = req.params.id;
	
	var query = "UPDATE salesforce.invoice__c SET ";
	query += "Name = '" + req.body.name + "', ";
	query += "Bill_To__c = " + (req.body.billto != null ? "'" + req.body.billto + "'" : "null") + ", ";
	query += "Order__c = " + (req.body.order != null ? "'" + req.body.order + "'" : "null") + ", ";
	query += "Ship_To__c = " + (req.body.shipto != null ? "'" + req.body.shipto + "'" : "null") + ", ";
	query += "Billing_Type__c = '" + req.body.billtype + "', ";
	query += "Billing_Date__c = '" + req.body.date + "', ";
	query += "Customer_PO_No__c = '" + req.body.po + "', ";
	query += "Delivery_Order__c = '" + req.body.do + "', ";
	query += "Inco_Term__c = '" + req.body.inco + "', ";
	query += "Payment_Term__c = '" + req.body.payment + "', ";
	query += "Sales_Man__c = " + (req.body.salesman != null ? "'" + req.body.salesman + "'" : "null") + ", ";
	query += "Sales_Order__c = '" + req.body.so + "', ";
	query += "VAT__c = " + req.body.vat + ", ";
	query += "Sub_Total__c = " + req.body.total + ", ";
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

exports.updateInvoiceList = function(req, res, next) {
	var id = req.params.id;
	
	var query = "UPDATE salesforce.invoice__c as o SET ";
	query += "Name = d.Name, Bill_To__c = d.Bill_To__c, Order__c = d.Order__c, Ship_To__c = d.Ship_To__c, ";
	query += "Billing_Type__c = d.Billing_Type__c, Billing_Date__c = d.Billing_Date__c, Customer_PO_No__c = d.Customer_PO_No__c, ";
	query += "Delivery_Order__c = d.Delivery_Order__c, Inco_Term__c = d.Inco_Term__c, Payment_Term__c = d.Payment_Term__c, ";
	query += "Sales_Man__c = d.Sales_Man__c, Sales_Order__c = d.Sales_Order__c, VAT__c = d.VAT__c, Sub_Total__c = d.Sub_Total__c, ";
	query += "systemmodstamp = CURRENT_TIMESTAMP from (values ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].name + "', ";
		query += (req.body[i].billto != null ? "'" + req.body[i].billto + "'" : "null") + ", " ;
		query += (req.body[i].order != null ? "'" + req.body[i].order + "'" : "null") + ", " ;
		query += (req.body[i].shipto != null ? "'" + req.body[i].shipto + "'" : "null") + ", '" ;
		query += req.body[i].billtype + "', '" + req.body[i].date + "', '" + req.body[i].po + "', '";
		query += req.body[i].do + "', '" + req.body[i].inco + "', '" + req.body[i].payment + "', ";
		query += (req.body[i].salesman != null ? "'" + req.body[i].salesman + "'" : "null") + ", '" ;
		query += req.body[i].so + "', " + req.body[i].vat + ", " + req.body[i].total + " ";
		query += "), ";
	}
	if(req.body.length > 0)
	{
		query = query.substr(0, query.length - 2);
		query += ") as d(sfid, Name, Bill_To__c, Order__c, Ship_To__c, Billing_Type__c, Billing_Date__c, ";
		query += "Customer_PO_No__c, Delivery_Order__c, Inco_Term__c, Payment_Term__c, Sales_Man__c, "
		query += "Sales_Order__c, VAT__c, Sub_Total__c) WHERE o.sfid = d.sfid";
		console.log(query);

		db.select(query)
		.then(function(results) {
			res.send('{ \"status\": "success" }');
		})
		.catch(next);
	}
	else { res.send('{ \"status\": "no data" }'); }
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

exports.deleteInvoiceList = function(req, res, next) {
	var invoiceList = "(";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		invoiceList += "'" + req.body[i].sfid + "', ";
	}
	invoiceList = invoiceList.substr(0, invoiceList.length - 2);
	invoiceList += ")";
	//var query = "DELETE FROM salesforce.invoice__c WHERE sfid IN " + invoiceList;	
	var query = "UPDATE salesforce.invoice__c SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid IN " + invoiceList; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
