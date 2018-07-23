var db = require('./pghelper');

exports.createOrderProductList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	
	var query = "INSERT INTO salesforce.order_product__c ( sfid, guid, Name, order__c, product__c, pricebook_entry__c, ";
	query += "quantity__c, price__c, free_gift__c, parent_item__c, originalorder_guid, ";
	query += "createddate, systemmodstamp, IsDeleted ) VALUES ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].sfid + "', '" + req.body[i].name + "', '" + req.body[i].order + "', ";
		query += (req.body[i].product != null ?  "'" + req.body[i].product + "'" : "null") + ", ";
		query += (req.body[i].pricebookentry != null ? "'" + req.body[i].pricebookentry + "'" : "null") + ", ";
		query += req.body[i].quantity + ", ";
		query += req.body[i].price + ", " + req.body[i].free + ", '" + req.body[i].parent + "', '" + req.body[i].parent + "', ";
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

exports.updateOrderProductList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
  
	var query = "UPDATE salesforce.order_product__c as o SET ";
	query += "product__c = d.product__c, pricebook_entry__c = d.pricebook_entry__c, ";
	query += "quantity__c = d.quantity__c, price__c = d.price__c, free_gift__c = d.free_gift__c, ";
	query += "parent_item__c = d.parent_item__c, parent_guid = null, ";
	query += "systemmodstamp = CURRENT_TIMESTAMP from (values ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', " + (req.body[i].product != null ?  "'" + req.body[i].product + "'" : "null") + ", '";
		query += (req.body[i].pricebookentry != null ? "'" + req.body[i].pricebookentry + "'" : "null") + "', ";
		query += req.body[i].quantity + ", " + req.body[i].price + ", " + req.body[i].free + ", '";
		query += req.body[i].parent + "' ";
		query += "), ";
	}
	if(req.body.length > 0)
	{
		query = query.substr(0, query.length - 2);
		query += ") as d(sfid, product__c, pricebook_entry__c, quantity__c, price__c, free_gift__c, ";
		query += "parent_item__c ) WHERE o.sfid = d.sfid";
		console.log(query);

		db.select(query)
		.then(function(results) {
			res.send('{ \"status\": "success" }');
		})
		.catch(next);
	}
	else { res.send('{ \"status\": "no data" }'); }
};

exports.deleteOrderProductList = function(req, res, next) {
	var orderProductList = "(";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		orderProductList += "'" + req.body[i].sfid + "', ";
	}
	orderProductList = orderProductList.substr(0, orderProductList.length - 2);
	orderProductList += ")";
  	//var query = "DELETE FROM salesforce.order_product__c WHERE sfid IN " + orderProductList;	
	var query = "UPDATE salesforce.order_product__c SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid IN " + orderProductList; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
