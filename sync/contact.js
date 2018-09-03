var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.sync = function(req, res, next) {
	var head = req.headers['authorization'];
	var lastsync = req.body.syncdate;
	var lastsync2 = req.body.syncdate;
	lastsync = new Date(lastsync);
	console.log('------------------Start Contact----------------');
	
	auth.authen(head)
	.then(function(obj) {
		var sales = obj.nickname;
		db.init()
  		.then(function(conn) {
			var query = "SELECT * FROM salesforce.Account WHERE sfid IN ";
			query += "(SELECT account__c FROM salesforce.account_team__c WHERE LOWER(salesman__c) = '" + sales + "')";
			db.query(query, conn) 
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

					var validData = true;
					var contactlist = "(";
					for(var i = 0 ; i < req.body.data.length ; i++)
					{
						if(req.body.data[i].id != null)
							contactlist += "'" + req.body.data[i].id + "', ";
						if(req.body.data[i].lastname == null) validData = false;
						if(req.body.data[i].account == null) validData = false;
					}
					contactlist = contactlist.substr(0, contactlist.length - 2);
					contactlist += ")";

					if(validData)
					{
						var query2 = "SELECT guid as id, Firstname, Lastname, Nickname__c as nickname, Department, Title as Position, ";
						query2 += "Phone, Mobilephone as Mobile, Email, AccountId as Account, IsDeleted, ";
						//query2 += "success as Success, errorcode as ErrorCode, errormessage as ErrorMessage, ";
						query2 += "to_char( systemmodstamp + interval '7 hour', 'YYYY-MM-DD HH24:MI:SS') as updatedate ";
						query2 += "FROM salesforce.Contact WHERE (accountId IN " + accountList + " and ";
						query2 += "systemmodstamp + interval '7 hour' > '" + lastsync2 + "') ";
						if(req.body.data.length > 0) query2 += "or guid IN " + contactlist;
						db.query(query2, conn)
						.then(function(results2) {
							for(var i = 0 ; i < results2.length ; i++)
							{
								results2[i].updatedate = results2[i].updatedate.replace(" ", "T") + "+07:00";
							}
							console.log('-----------------------------------------');
							console.log(req.body.data);
							console.log('-----------------------------------------');

							var output = buildResponse(req.body.data, results2, lastsync, next, conn);
							output = { "success": true, "errorcode" : "", "errormessage" : "", "data": output };
							//res.send("Finish!!");
							console.log(output);
							res.json(output);
						}, function(err) { res.json({ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }); })
					} else { res.json({ "success": false, "errorcode" :"10", "errormessage":"Invalid Data" }); }
				} else { res.json({ "success": false, "errorcode" :"02", "errormessage":"No Account" }); }
			}, function(err) { res.json({ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }); })
		}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"02", "errormessage":"initial Database fail." }'); })
	}, function(err) { res.json({ "success": false, "errorcode" :"00", "errormessage":"Authen Fail." }); })
};

function buildResponse(update, response, syncdate, next, conn)
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
	syncDB(update, action, next, conn);
	return response;
};

function syncDB(update, action, next, conn)
{
	if(update.length > 0)
	{
		if(action[0] == "insert")
		{
			var query = "INSERT INTO salesforce.Contact ( guid, ";
			if(update[0].firstname != null) query += "FirstName, ";
			if(update[0].lastname != null) query += "LastName, ";
			if(update[0].nickanme != null) query += "Nickname__c, ";
			if(update[0].phone != null) query += "Phone, ";
			if(update[0].position != null) query += "Title, ";
			if(update[0].email != null) query += "Email, ";
			if(update[0].department != null) query += "Department, ";
			if(update[0].account != null) query += "AccountId, ";
			query += "createddate, systemmodstamp, IsDeleted, sync_status ) VALUES ('";
			query += update[0].id + "',";
			if(update[0].firstname != null) query += " '" + update[0].firstname + "',";
			if(update[0].lastname != null) query += " '" + update[0].lastname + "',";
			if(update[0].nickanme != null) query += " '" + update[0].nickanme + "',";
			if(update[0].phone != null) query += " '" + update[0].phone + "',";
			if(update[0].position != null) query += " '" + update[0].position + "',";
			if(update[0].email != null) query += " '" + update[0].email + "',";
			if(update[0].department != null) query += " '" + update[0].department + "',";
			if(update[0].account != null) query += " '" + update[0].account + "', ";
			query += "CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'Mobile')";

			db.query(query, conn)
			.then(function(results) {
				update.shift();
				action.shift();
				syncDB(update, action, next, conn);
			})
			.catch(next);
		}
		else if (action[0] == "update")
		{
			var query = "UPDATE salesforce.Contact SET ";
			if(update[0].account != null) query += "AccountId = '" + update[0].account + "', ";
			if(update[0].firstname != null) query += "Firstname = '" + update[0].firstname + "', ";
			if(update[0].lastname != null) query += "Lastname = '" + update[0].lastname + "', ";
			if(update[0].nickanme != null) query += "Nickname__c = '" + update[0].nickanme + "', ";
			if(update[0].phone != null) query += "Phone = '" + update[0].phone + "', ";
			if(update[0].position != null) query += "Title = '" + update[0].position + "', ";
			if(update[0].email != null) query += "Email = '" + update[0].email + "', ";
			if(update[0].department != null) query += "Department = '" + update[0].department + "', ";
			if(update[0].mobile != null) query += "Mobilephone = '" + update[0].mobile + "', ";
			if(update[0].isdeleted != null) query += "Isdeleted = '" + update[0].isdeleted +"', ";
			query += "systemmodstamp = CURRENT_TIMESTAMP, ";
			query += "sync_status = 'Mobile' ";
			query += "WHERE guid = '" + update[0].id + "'";

			db.query(query, conn)
			.then(function(results) {
				update.shift();
				action.shift();
				syncDB(update, action, next, conn);
			})
			.catch(next);
		}	
		else
		{
			update.shift();
			action.shift();
			syncDB(update, action, next, conn);	
		}
	}
};
