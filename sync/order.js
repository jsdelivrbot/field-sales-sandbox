var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.sync = function(req, res, next) {
	var head = req.headers['authorization'];
	var lastsync = req.body.syncdate;
	var lastsync2 = req.body.syncdate;
	lastsync = new Date(lastsync)
	console.log(req.body.data);
	
	auth.authen(head)
	.then(function(obj) {
		var sales = obj.nickname;
		var query = "SELECT sfid from salesforce.salesman__c where LOWER(sfid) = '" + sales + "'";
		db.select(query)
		.then(function(results) {
			var orderlist = "(";
			for(var i = 0 ; i < req.body.data.length ; i++)
			{
				if(req.body.data[i].id != null)
					orderlist += "'" + req.body.data[i].id + "', ";
			}
			orderlist = orderlist.substr(0, orderlist.length - 2);
			orderlist += ")";
			
			var query2 = "SELECT guid as id, accountid as account, originalorder_guid as ParentOrder, visit_guid as Visit, is_split__c as issplit, ";
			query2 += " to_char( activateddate + interval '7 hour', 'YYYY-MM-DD') as orderdate, totalamount, status, ordernumber, ";
			//query2 += "success as Success, errorcode as ErrorCode, errormessage as ErrorMessage, ";
			query2 += "to_char( systemmodstamp + interval '7 hour', 'YYYY-MM-DD HH24:MI:SS') as updatedate , isdeleted ";
			query2 += "FROM salesforce.order WHERE (LOWER(salesman__c) = '" + sales + "' and ";
			query2 += "systemmodstamp + interval '7 hour' > '" + lastsync2 + "') ";
			if(req.body.data.length > 0 ) query2 += "or guid IN " + orderlist;
			db.select(query2)
			.then(function(results2) {
				for(var i = 0 ; i < results2.length ; i++)
				{
					results2[i].updatedate = results2[i].updatedate.replace(" ", "T") + "+07:00";
				}
				var output = buildResponse(req.body.data, results2, lastsync, results[0].sfid, next);
				output = { "success": true, "errorcode" : "", "errormessage" : "", "data": output };
				//res.send("Finish!!");
				//console.log(output);
				res.json(output);
			}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }'); })
		}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }'); })
	}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"00", "errormessage":"Authen Fail." }'); })
};

function buildResponse(update, response, syncdate, sales, next)
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
	syncDB(update, action, sales, next);
	return response;
};

function syncDB(update, action, sales, next)
{
	if(update.length > 0)
	{
		if(action[0] == "insert")
		{
			var query = "INSERT INTO salesforce.order ( guid, ";
			if(update[0].account != null) query += "accountid, ";
			if(update[0].parentorder != null) query += "originalorder_guid, ";
			if(update[0].visit != null) query += "visit_guid, ";
			if(update[0].orderdate != null) query += "activateddate, ";
			if(update[0].totalamount != null) query += "totalamount, ";
			query += "salesman__c, status, createddate, systemmodstamp, IsDeleted, sync_status ) VALUES ('";
			query += update[0].id + "',";
			if(update[0].account != null) query += " '" + update[0].account + "',";
			if(update[0].parentorder != null) query += " '" + update[0].parentorder + "',";
			if(update[0].visit != null) query += " '" + update[0].visit + "',";
			if(update[0].orderdate != null) query += " '" + update[0].orderdate + "',";
			if(update[0].totalamount != null) query += " '" + update[0].totalamount + "',";
			query += "'" + sales + "', 'In Process', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'Mobile')";

			db.select(query)
			.then(function(results) {
				update.shift();
				action.shift();
				syncDB(update, action, sales, next);
			})
			.catch(next);
		}
		else if (action[0] == "update")
		{
			var query = "UPDATE salesforce.order SET ";
			if(update[0].account != null) query += "accountid = '" + update[0].account + "', ";
			if(update[0].parentorder != null) query += "originalorder_guid = '" + update[0].parentorder + "', ";
			if(update[0].visit != null) query += "visit_guid = '" + update[0].visit + "', ";
			if(update[0].orderdate != null) query += "activateddate = '" + update[0].orderdate + "', ";
			if(update[0].totalamount != null) query += "totalamount = '" + update[0].totalamount + "', ";
			if(update[0].isdeleted != null) query += "Isdeleted = '" + update[0].isdeleted +"', ";
			query += "salesman__c = '" + sales + "', ";
			query += "systemmodstamp = CURRENT_TIMESTAMP, ";
			query += "sync_status = 'Mobile' ";
			query += "WHERE guid = '" + update[0].id + "'";

			db.select(query)
			.then(function(results) {
				update.shift();
				action.shift();
				syncDB(update, action, sales, next);
			})
			.catch(next);
		}
		else
		{
			update.shift();
			action.shift();
			syncDB(update, action, sales, next);
		}
	}
};
