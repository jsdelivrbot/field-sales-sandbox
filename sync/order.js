var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.sync = function(req, res, next) {
	var head = req.headers['authorization'];
	var lastsync = req.headers['lastsync'];
	lastsync = new Date(lastsync)
	
	auth.authen(head)
	.then(function(obj) {
		var sales = obj.nickname;
		var query = "SELECT * FROM salesforce.Account WHERE sfid IN ";
		query += "(SELECT account__c FROM salesforce.account_team__c WHERE LOWER(salesman__c) = '" + sales + "')";
		db.select(query) 
		.then(function(results) {
			if(results.length > 0)
			{
				var accountList = "(";
				for(var i = 0 ; i < results.length ; i++)
				{
					accountList += "'" + results[i].sfid + "', ";
				}
				accountList = accountList.substr(0, accountList.length - 2);
				accountList += ")";
				
				var query2 = "SELECT guid, accountid, ship_to__c, originalorderid, call_visit__c, delivery_date__c, ";
				query2 += "activateddate, totalamount, status, note__c, is_planned__c, pricebook2id, ordernumber ";
				query2 += "FROM salesforce.order WHERE accountId IN " + accountList;
				db.select(query2)
				.then(function(results2) {
				      	var output = buildResponse(req.body, results2, lastsync, next)
					//res.send("Finish!!");
					console.log(output);
					res.json(output);
				}) 
				.catch(next);
			}
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
	syncDB(update, action, next);
	return response;
};

function syncDB(update, action, next)
{
	if(update.length > 0)
	{
		if(action[0] == "insert")
		{
			var query = "INSERT INTO salesforce.order ( guid, ";
			if(update[0].BillTo != null) query += "accountid, ";
			if(update[0].ShipTo != null) query += "ship_to__c, ";
			if(update[0].ParentOrder != null) query += "originalorderid, ";
			if(update[0].Visit != null) query += "call_visit__c, ";
			if(update[0].DeliveryDate != null) query += "delivery_date__c, ";
			if(update[0].OrderDate != null) query += "activateddate, ";
			if(update[0].TotalAmount != null) query += "totalamount, ";
			if(update[0].Status != null) query += "status, ";
			if(update[0].Note != null) query += "note__c, ";
			if(update[0].IsPlanned != null) query += "is_planned__c, ";
			if(update[0].Pricebook != null) query += "pricebook2id, ";
			query += "createddate, systemmodstamp, IsDeleted, sync_status ) VALUES ('";
			query += update[0].GUID + "',";
			if(update[0].BillTo != null) query += " '" + update[0].BillTo + "',";
			if(update[0].ShipTo != null) query += " '" + update[0].ShipTo + "',";
			if(update[0].ParentOrder != null) query += " '" + update[0].ParentOrder + "',";
			if(update[0].Visit != null) query += " '" + update[0].Visit + "',";
			if(update[0].DeliveryDate != null) query += " '" + update[0].DeliveryDate + "',";
			if(update[0].OrderDate != null) query += " '" + update[0].OrderDate + "',";
			if(update[0].TotalAmount != null) query += " '" + update[0].TotalAmount + "',";
			if(update[0].Status != null) query += " '" + update[0].Status + "', ";
			if(update[0].Note != null) query += " '" + update[0].Note + "', ";
			if(update[0].IsPlanned != null) query += " " + update[0].IsPlanned + ", ";
			if(update[0].Pricebook != null) query += " '" + update[0].Pricebook + "', ";
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
			if(update[0].BillTo != null) query += "accountid = '" + update[0].BillTo + "', ";
			if(update[0].ShipTo != null) query += "ship_to__c = '" + update[0].ShipTo + "', ";
			if(update[0].ParentOrder != null) query += "originalorderid = '" + update[0].ParentOrder + "', ";
			if(update[0].Visit != null) query += "call_visit__c = '" + update[0].Visit + "', ";
			if(update[0].DeliveryDate != null) query += "delivery_date__c = '" + update[0].DeliveryDate + "', ";
			if(update[0].OrderDate != null) query += "activateddate = '" + update[0].OrderDate + "', ";
			if(update[0].TotalAmount != null) query += "totalamount = '" + update[0].TotalAmount + "', ";
			if(update[0].Status != null) query += "status = '" + update[0].Status + "', ";
			if(update[0].Note != null) query += "note__c = '" + update[0].Note + "', ";
			if(update[0].IsPlanned != null) query += "is_planned__c = " + update[0].IsPlanned + ", ";
			if(update[0].Pricebook != null) query += "pricebook2id = '" + update[0].Pricebook + "', ";
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
