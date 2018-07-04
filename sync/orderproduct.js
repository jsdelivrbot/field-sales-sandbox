var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.sync = function(req, res, next) {
	var head = req.headers['authorization'];
	var lastsync = req.headers['lastsync'];
	lastsync = new Date(lastsync)
	
	auth.authen(head)
	.then(function(obj) {
		var sales = obj.nickname;
		var query = "SELECT guid from salesforce.order where LOWER(salesman__c) = '" + sales + "'";
		db.select(query)
		.then(function(results) {
			var orderList = "(";
			for(var i = 0 ; i < results.length ; i++)
			{
				orderList += "'" + results[i].guid + "', ";
			}
			orderList = orderList.substr(0, orderList.length - 2);
			orderList += ")";
			
			var query2 = "SELECT guid, product__c, pricebook_entry__c, order_guid, parent_guid, quantity__c, price__c, ";
			query2 += "free_gift__c, isdeleted, ";
			query2 += "systemmodstamp ";
			query2 += "FROM salesforce.order_product__c WHERE order_guid IN " + orderList + " and ";
			query2 += "systemmodstamp > '" + lastsync + "'";
			db.select(query2)
			.then(function(results2) {
				var output = buildResponse(req.body, results2, lastsync, next)
				//res.send("Finish!!");
				console.log(output);
				res.json(output);
			}) 
			.catch(next);
		}) 
		.catch(next);
	}, function(err) { res.status(887).send("{ \"status\": \"fail\" }"); })
};

function buildResponse(update, response, syncdate, next)
{
	var action = [];
	for(var j = 0 ; j < update.length ; j++)
	{
		var found = false;
		var isInsert = true;
		for(var i = 0 ; i < response.length && isInsert; i++)
		{
			if(update[j].GUID == response[i].guid)
			{
				found = true;
				if(syncdate > response[i].systemmodstamp)
				{
					isInsert = false;
				}
				response.splice(i, 1);
			}
		}
		if(!found) { action.push("insert"); }
		else if(!isInsert) { action.push("update"); }
		else { action.push("none"); }
	}
	syncDB(update, action, sales, next);
	return response;
};

function syncDB(update, action, next)
{
	if(update.length > 0)
	{
		if(action[0] == "insert")
		{
			var query = "INSERT INTO salesforce.order ( guid, ";
			if(update[0].Product != null) query += "product__c, ";
			if(update[0].PricebookEntry != null) query += "pricebook_entry__c, ";
			if(update[0].Order != null) query += "order_guid, ";
			if(update[0].Parent != null) query += "parent_guid, ";
			if(update[0].Quantity != null) query += "quantity__c, ";
			if(update[0].Price != null) query += "price__c, ";
			if(update[0].Free != null) query += "free_gift__c, ";
			query += "createddate, systemmodstamp, IsDeleted, sync_status ) VALUES ('";
			query += update[0].GUID + "',";
			if(update[0].Product != null) query += " '" + update[0].Product + "',";
			if(update[0].PricebookEntry != null) query += " '" + update[0].PricebookEntry + "',";
			if(update[0].Order != null) query += " '" + update[0].Order + "',";
			if(update[0].Parent != null) query += " '" + update[0].Parent + "',";
			if(update[0].Quantity != null) query += " '" + update[0].Quantity + "',";
			if(update[0].Price != null) query += " '" + update[0].Price + "',";
			if(update[0].Free != null) query += " '" + update[0].Free + "',";
			query += "CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'Mobile')";

			db.select(query)
			.then(function(results) {
				update.shift();
				action.shift();
				syncDB(update, action, next);
			})
			.catch(next);
		}
		else if (action[0] == "update")
		{
			var query = "UPDATE salesforce.order SET ";
			if(update[0].Product != null) query += "product__c = '" + update[0].Product + "', ";
			if(update[0].PricebookEntry != null) query += "pricebook_entry__c = '" + update[0].PricebookEntry + "', ";
			if(update[0].Order != null) query += "order_guid = '" + update[0].Order + "', ";
			if(update[0].Parent != null) query += "parent_guid = '" + update[0].Parent + "', ";
			if(update[0].Quantity != null) query += "quantity__c = '" + update[0].Quantity + "', ";
			if(update[0].Price != null) query += "price__c = '" + update[0].Price + "', ";
			if(update[0].Free != null) query += "free_gift__c = '" + update[0].Free + "', ";
			if(update[0].IsDeleted != null) query += "Isdeleted = '" + update[0].IsDeleted +"', ";
			query += "systemmodstamp = CURRENT_TIMESTAMP, ";
			query += "sync_status = 'Mobile' ";
			query += "WHERE guid = '" + update[0].GUID + "'";

			db.select(query)
			.then(function(results) {
				update.shift();
				action.shift();
				syncDB(update, action, next);
			})
			.catch(next);
		}	
	}
};
