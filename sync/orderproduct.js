var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.sync = function(req, res, next) {
	var head = req.headers['authorization'];
	var lastsync = req.body.syncdate;
	var lastsync2 = req.body.syncdate;
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
			
			var validData = true;
			var orderproductList = "(";
			for(var i = 0 ; i < req.body.data.length ; i++)
			{
				if(req.body.data[i].id != null)
					orderproductList += "'" + req.body.data[i].id + "', ";
				if(req.body.data[i].product == null) validData = false;
				if(req.body.data[i].order == null) validData = false;
			}
			orderproductList = orderproductList.substr(0, orderproductList.length - 2);
			orderproductList += ")";
			
			if(validData)
			{
				var query2 = "SELECT guid as id, product__c as product, pricebook_entry__c as pricebookentry, order_guid as order, ";
				query2 += "quantity__c as quantity, price__c as price, ";
				query2 += "free_gift__c as free, isdeleted, ";
				//query2 += "success as Success, errorcode as ErrorCode, errormessage as ErrorMessage, ";
				query2 += "to_char( systemmodstamp + interval '7 hour', 'YYYY-MM-DD HH24:MI:SS') as updatedate ";
				query2 += "FROM salesforce.order_product__c WHERE (order_guid IN " + orderList + " and ";
				query2 += "systemmodstamp + interval '7 hour' > '" + lastsync2 + "') ";
				if(req.body.data.length > 0) query2 += "or guid IN " + orderproductList;
				db.select(query2)
				.then(function(results2) {
					for(var i = 0 ; i < results2.length ; i++)
					{
						results2[i].updatedate = results2[i].updatedate.replace(" ", "T") + "+07:00";
					}
					var output = buildResponse(req.body.data, results2, lastsync, next);
					output = { "success": true, "errorcode" : "", "errormessage" : "", "data": output };
					//res.send("Finish!!");
					console.log(output);
					res.json(output);
				}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }'); })
			} else { res.json({ "success": false, "errorcode" :"10", "errormessage":"Invalid Data" }); }
		}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }'); })
	}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"00", "errormessage":"Authen Fail." }'); })
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
			if(update[j].id == response[i].id)
			{
				found = true;
				var updateddate = new Date(update[j].updateddate);
				var serverupdatedate = new Date(response[i].updateddate);
				if(updateddate > serverupdatedate)
				{
					isInsert = false;
					response.splice(i, 1);
				}
			}
		}
		if(!found) { action.push("insert"); }
		else if(!isInsert) { action.push("update"); }
		else { action.push("none"); }
	}
	syncDB(update, action, next);
	return response;
};

function syncDB(update, action, next)
{
	if(update.length > 0)
	{
		if(action[0] == "insert")
		{
			var query = "INSERT INTO salesforce.order_product__c ( guid, ";
			if(update[0].product != null) query += "product__c, ";
			if(update[0].pricebookentry != null) query += "pricebook_entry__c, ";
			if(update[0].order != null) query += "order_guid, ";
			if(update[0].parent != null) query += "parent_guid, ";
			if(update[0].quantity != null) query += "quantity__c, ";
			if(update[0].price != null) query += "price__c, ";
			if(update[0].free != null) query += "free_gift__c, ";
			query += "createddate, systemmodstamp, IsDeleted, sync_status ) VALUES ('";
			query += update[0].id + "',";
			if(update[0].product != null) query += " '" + update[0].product + "',";
			if(update[0].pricebookentry != null) query += " '" + update[0].pricebookentry + "',";
			if(update[0].order != null) query += " '" + update[0].order + "',";
			if(update[0].parent != null) query += " '" + update[0].parent + "',";
			if(update[0].quantity != null) query += " '" + update[0].quantity + "',";
			if(update[0].price != null) query += " '" + update[0].price + "',";
			if(update[0].free != null) query += " '" + update[0].free + "',";
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
			var query = "UPDATE salesforce.order_product__c SET ";
			if(update[0].product != null) query += "product__c = '" + update[0].product + "', ";
			if(update[0].pricebookEntry != null) query += "pricebook_entry__c = '" + update[0].pricebookentry + "', ";
			if(update[0].order != null) query += "order_guid = '" + update[0].order + "', ";
			if(update[0].parent != null) query += "parent_guid = '" + update[0].parent + "', ";
			if(update[0].quantity != null) query += "quantity__c = '" + update[0].quantity + "', ";
			if(update[0].price != null) query += "price__c = '" + update[0].price + "', ";
			if(update[0].free != null) query += "free_gift__c = '" + update[0].free + "', ";
			if(update[0].isdeleted != null) query += "Isdeleted = '" + update[0].isdeleted +"', ";
			query += "systemmodstamp = CURRENT_TIMESTAMP, ";
			query += "sync_status = 'Mobile' ";
			query += "WHERE guid = '" + update[0].id + "'";

			db.select(query)
			.then(function(results) {
				update.shift();
				action.shift();
				syncDB(update, action, next);
			})
			.catch(next);
		}	
		else
		{
			update.shift();
			action.shift();
			syncDB(update, action, next);
		}
	}
};
