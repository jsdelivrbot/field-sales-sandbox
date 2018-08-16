var db = require('./pghelper');
var auth = require('./auth0');

exports.getList = function(req, res, next) {
	var head = req.headers['authorization'];
	var limit = req.headers['limit'];
	var start = req.headers['start'];
  	var startdate = req.headers['start-date'];
	
  	auth.authen(head)
	.then(function(obj) {
		var sales = obj.nickname;
		var query = "SELECT * FROM salesforce.order WHERE LOWER(salesman__c) = '" + sales;
		if(startdate != null)
		{
			query += " and createddate > '" + startdate;
		}
		query += "' Order by delivery_date__c asc";
		if(!isNaN(limit) && limit > 0)
		{
			query += " limit " + limit;
		}
		if(!isNaN(start) && start > 0)
		{
			query += " OFFSET  " + start;
		}
		console.log(query);
		db.select(query)
		.then(function(results) {
			var orderList = "(";
			for(var i = 0 ; i < results.length ; i++)
			{
				orderList += "'" + results[i].sfid + "', ";
			}
			orderList = orderList.substr(0, orderList.length - 2);
			orderList += ")";

			var query2 = "SELECT * FROM salesforce.orderitem WHERE orderId IN " + orderList;
			console.log(query2);
			db.select(query2)
			.then(function(results2) {
				var query3 = "SELECT * FROM salesforce.invoice__c WHERE order__c IN " + orderList;
				console.log(query3);
				db.select(query3)
				.then(function(results3) {
					var output = '[';
					for(var i = 0 ; i < results.length ; i++)
					{
						output += '{"sfid":"' + results[i].sfid;
						output += '", "ฺAccount":"' + results[i].accountid;
						output += '", "ParentOrder":"' + results[i].originalorderid;
						output += '", "CallVisit":"' + results[i].call_visit__c;
						output += '", "OrderDate":"' + results[i].activateddate;
						output += '", "TotalAmount":"' + results[i].totalamount;
						output += '", "Status":"' + results[i].status;
						output += '", "IsSplit":' + results[i].is_split__c;
						var lineitem = '[';
						for(var j = 0 ; j < results2.length ; j++)
						{
							lineitem += '{"sfid":"' + results2[j].sfid;
							lineitem += '", "Product2Id":"' + results2[j].product2id;
							lineitem += '", "OrderId":"' + results2[j].orderid;
							lineitem += '", "Quantity":"' + results2[j].quantity;
							lineitem += '", "UnitPrice":"' + results2[j].unitprice;
							lineitem += '", "Discount":"' + results2[j].discount__c;
							lineitem += '", "LTP":"' + results2[j].LTP;
							lineitem += '", "FreeGift":"' + results2[j].free_gift__c;
							lineitem += '", "SizeinGrams":"' + results2[j].size_in_grams__c;
							lineitem += '", "IsDeleted":' + results2[j].isdeleted;
							lineitem += ', "systemmodstamp":"' + results2[j].systemmodstamp + '"},';

						}
						if(lineitem.length > 1)
						{
							lineitem = lineitem.substr(0, lineitem.length - 1);
						}
						lineitem += ']';
						output += ', "lineitem":' + lineitem;
						var invoices = '[';
						for(var j = 0 ; j < results3.length ; j++)
						{
							invoices += '{"sfid":"' + results3[j].sfid;
							invoices += '", "Order":"' + results3[j].order__c;
							invoices += '", "BillTo":"' + results3[j].bill_to__c;
							invoices += '", "Name":"' + results3[j].name;
							invoices += '", "ShipTo":"' + results3[j].ship_to__c;
							invoices += '", "BillingType":"' + results3[j].billing_type__c;
							invoices += '", "BillingDate":"' + results3[j].billing_date__c;
							invoices += '", "PO No":"' + results3[j].customer_po_no__c;
							invoices += '", "DeliveryOrder":"' + results3[j].delivery_order__c;
							invoices += '", "IncoTerm":"' + results3[j].inco_term__c;
							invoices += '", "PaymentTerm":"' + results3[j].payment_term__c;
							invoices += '", "SalesMan":"' + results3[j].sales_man__c;
							invoices += '", "SalesOrder_":"' + results3[j].sales_order__c;
							invoices += '", "VAT":"' + results3[j].vat__c;
							invoices += '", "SubTotal":"' + results3[j].sub_total__c;
							invoices += '", "IsDeleted":' + results3[j].isdeleted;
							invoices += ', "systemmodstamp":"' + results3[j].systemmodstamp + '"},';

						}
						if(invoices.length > 1)
						{
							invoices = invoices.substr(0, invoices.length - 1);
						}
						invoices += ']';
						output += ', "invoice":' + invoices;
						output += ', "IsDeleted":' + results[i].isdeleted;
						output += ', "systemmodstamp":"' + results[i].systemmodstamp + '"},';
					}
					if(results.length)
					{
						output = output.substr(0, output.length - 1);
					}
					output += ']';
					console.log(output);
					res.json(JSON.parse(output));
				}) 
				.catch(next);

			}) 
			.catch(next); 
		}) 
		.catch(next); 	
	}, function(err) { res.status(887).send("{ \"status\": \"fail\" }"); })
};

exports.createOrder = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	if (req.body.ordernumber == null) return res.send('{ \"status\": "fail", \"message\": "No Order Number" }');
	if (req.body.account == null) return res.send('{ \"status\": "fail", \"message\": "No Account" }');

	var query = "INSERT INTO salesforce.order ( sfid, guid, ordernumber, accountid, delivery_date__c, note__c, status, ";
	query += "salesman__c, call_visit__c, visit_guid, totalamount, originalorderid, originalorder_guid, activateddate, ";
	query += "is_split__c, createddate, systemmodstamp, IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.sfid + "', '" + req.body.ordernumber + "', ";
	query += (req.body.account != null ? "'" + req.body.account + "'" : "null") + ", ";
	query += (req.body.deliverydate != null ? "'" + req.body.deliverydate + "'" : "null") + ", '";
	query += req.body.note + "', '" + req.body.status + "', '";
	query += req.body.salesman + "', ";
	query += (req.body.visit != null ? "'" + req.body.visit + "'" : "null") + ", ";
	query += (req.body.visit != null ? "'" + req.body.visit + "'" : "null") + ", " + req.body.amount + ", ";
	query += (req.body.parent != null ? "'" + req.body.parent + "'" : "null") + ", ";
	query += (req.body.parent != null ? "'" + req.body.parent + "'" : "null") + ", '" + req.body.date + "', ";
	if(req.body.issplit != null) query += req.body.issplit + ", ";
	query += "CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.createOrderList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);

	var haveRecord = false;
	var query = "INSERT INTO salesforce.order ( sfid, guid, ordernumber, accountid, delivery_date__c, note__c, status, ";
	query += "salesman__c, call_visit__c, visit_guid, totalamount, originalorderid, originalorder_guid, activateddate, ";
	query += "is_split__c, createddate, systemmodstamp, IsDeleted ) VALUES ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		if(req.body[i].ordernumber != null && req.body[i].account != null)
		{
			query += "('" + req.body[i].sfid + "', '" + req.body[i].sfid + "', '" + req.body[i].ordernumber + "', '";
			query += req.body[i].account + "', ";
			query += (req.body[i].deliverydate != null ? "'" + req.body[i].deliverydate + "'" : "null") + ", '";
			query += req.body[i].note + "', '" + req.body[i].status + "', '" + req.body[i].salesman + "', ";
			query += (req.body[i].visit != null ? "'" + req.body[i].visit + "'" : "null") + ", ";
			query += (req.body[i].visit != null ? "'" + req.body[i].visit + "'" : "null") + ", ";
			query += req.body[i].amount + ", ";
			query += (req.body[i].parent != null ? "'" + req.body[i].parent + "'" : "null" ) + ", ";
			query += (req.body[i].parent != null ? "'" + req.body[i].parent + "'" : "null" ) + ", '" + req.body[i].date + "', ";
			query += req.body[i].issplit + ", ";
			query += "CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false), ";
			haveRecord = true;
		}
	}
	if(haveRecord == true)
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

exports.updateOrder = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);
	if (req.body.ordernumber == null) return res.send('{ \"status\": "fail", \"message\": "No Order Number" }');
	if (req.body.account == null) return res.send('{ \"status\": "fail", \"message\": "No Account" }');
  
	var query = "UPDATE salesforce.order SET ";
	query += "accountid = '" + req.body.account + "', ";
	query += "delivery_date__c = " + (req.body.deliverydate != null ? "'" + req.body.deliverydate + "'" : "null") + ", ";
	query += "note__c = '" + req.body.note + "', ";
	query += "status = '" + req.body.status + "', ";
	query += "salesman__c = '" + req.body.salesman + "', ";
	query += "call_visit__c = " + (req.body[i].visit != null ? "'" + req.body[i].visit + "'" : "null") + ", ";
	query += "visit_guid = '', ";
	query += "totalamount = " + req.body.amount + ", ";
	query += "originalorderid = " + (req.body.parent != null ? "'" + req.body.parent + "'" : "null") + ", ";
	query += "originalorder_guid = '', ";
	query += "activeddate = '" + req.body.parent + "', ";
	query += "is_split__c = " + req.body.issplit + ", ";
	query += "ordernumber = '" + req.body.ordernumber + "', ";
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

exports.updateOrderList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
  
	var haveRecord = false;
	var query = "UPDATE salesforce.order as o SET ";
	query += "accountid = d.accountid, delivery_date__c = Date(d.delivery_date__c), note__c = d.note__c, ";
	query += "status = d.status, salesman__c = d.salesman__c, call_visit__c = d.call_visit__c, visit_guid = d.visit_guid, ";
	query += "totalamount = d.totalamount, originalorderid = d.originalorderid, originalorder_guid = d.originalorder_guid, ";
	query += "activateddate = Date(d.activateddate), is_split__c = d.is_split__c, ordernumber = d.ordernumber, ";
	query += "systemmodstamp = CURRENT_TIMESTAMP from (values ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		if(req.body[i].ordernumber != null && req.body[i].account != null)
		{
			query += "('" + req.body[i].sfid + "', '" + req.body[i].account + "', ";
			query += (req.body.deliverydate != null ? "'" + req.body.deliverydate + "'" : "null") + ", '";
			query += req.body[i].note + "', '" + req.body[i].status + "', '";
			query += req.body[i].salesman + "', " + (req.body[i].visit != null ? "'" + req.body[i].visit + "'" : "null") + ", null, ";
			query += req.body[i].amount + ", " + (req.body[i].parent != null ? "'" + req.body[i].parent + "'" : "null") + ", null, '";
			query += req.body[i].date + "', " + req.body[i].issplit + ", '" + req.body[i].ordernumber + "'";
			query += "), ";
			haveRecord = true;
		}
	}
	if(haveRecord == true)
	{
		query = query.substr(0, query.length - 2);
		query += ") as d(sfid, accountid, delivery_date__c, note__c, status, salesman__c, ";
		query += "call_visit__c, visit_guid, totalamount, originalorderid, originalorder_guid, activateddate, is_split__c, ordernumber";
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

exports.deleteOrder = function(req, res, next) {
	var id = req.params.id;
	//var query = "DELETE FROM salesforce.order WHERE sfid = '" + id + "'";	
	var query = "UPDATE salesforce.order SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid ='" + id + "'"; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.deleteOrderList = function(req, res, next) {
	var orderList = "(";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		orderList += "'" + req.body[i].sfid + "', ";
	}
	orderList = orderList.substr(0, orderList.length - 2);
	orderList += ")";

	//var query = "DELETE FROM salesforce.order WHERE sfid IN " + orderList;	
	var query = "UPDATE salesforce.order SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid IN " + orderList; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
