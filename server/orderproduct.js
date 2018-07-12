var db = require('./pghelper');

exports.createOrderProductList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	
	var query = "INSERT INTO salesforce.order_product__c ( sfid, guid, Name, order__c, product__c, pricebook_entry__c, ";
	query += "quantity__c, price__c, free_gift__c, parent_item__c, ";
	query += "createddate, systemmodstamp, IsDeleted ) VALUES ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].sfid + "', '" + req.body[i].name + "', '" + req.body[i].order + "', '";
		query += req.body[i].product + "', " + req.body[i].pricebookentry + ", " + req.body[i].quantity + ", ";
		query += req.body[i].price + ", " + req.body[i].free + ", " + req.body[i].parent + ", ";
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
