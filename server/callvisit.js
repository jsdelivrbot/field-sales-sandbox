var db = require('./pghelper');
var auth = require('./auth0');
var sf = require('./salesforce');

exports.createCallVisit = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	if (req.body.account == null) return res.send('{ \"status\": "fail", \"message\": "No Account" }');
	if (req.body.salesman == null) return res.send('{ \"status\": "fail", \"message\": "No Salesman" }');
	if (req.body.start == null) return res.send('{ \"status\": "fail", \"message\": "No Start" }');
	if (req.body.end == null) return res.send('{ \"status\": "fail", \"message\": "No End" }');
	if (req.body.calltype == null) return res.send('{ \"status\": "fail", \"message\": "No Type" }');
	if (req.body.status == null) return res.send('{ \"status\": "fail", \"message\": "No Status" }');

	var query = "INSERT INTO salesforce.call_visit__c ( sfid, guid, Name, Account__c, Salesman__c, Plan_Start__c, ";
	query += "Plan_End__c, Call_Type__c, Status__c, Comment__c, createddate, systemmodstamp, ";
	query += "IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.sfid + "', '" + req.body.name + "', '" + req.body.account + "', '" + req.body.salesman + "', '";
	query += req.body.start + "', '" + req.body.end + "', '" + req.body.calltype + "', '" + req.body.status + "', '";
	query += req.body.comment + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.createCallVisitList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);

	var haveRecord = false;
	var query = "INSERT INTO salesforce.call_visit__c ( sfid, guid, Name, Account__c, Salesman__c, Plan_Start__c, ";
	query += "Plan_End__c, Call_Type__c, Status__c, Comment__c, createddate, systemmodstamp, ";
	query += "IsDeleted ) VALUES ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		if(req.body[i].account != null && req.body[i].salesman != null && req.body[i].start != null &&
		   req.body[i].end != null && req.body[i].calltype != null && req.body[i].status != null)
		{
			query += "('" + req.body[i].sfid + "', '" + req.body[i].sfid + "', '" + req.body[i].name + "', '";
			query += req.body[i].account + "', '" + req.body[i].salesman + "', '" + req.body[i].start + "', '";
			query += req.body[i].end + "', '" + req.body[i].calltype + "', '" + req.body[i].status + "', '";
			query += req.body[i].comment + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false), ";
			haveRecord = false;
		}
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

exports.updateCallVisit = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);
	if (req.body.account == null) return res.send('{ \"status\": "fail", \"message\": "No Account" }');
	if (req.body.salesman == null) return res.send('{ \"status\": "fail", \"message\": "No Salesman" }');
	if (req.body.start == null) return res.send('{ \"status\": "fail", \"message\": "No Start" }');
	if (req.body.end == null) return res.send('{ \"status\": "fail", \"message\": "No End" }');
	if (req.body.calltype == null) return res.send('{ \"status\": "fail", \"message\": "No Type" }');
	if (req.body.status == null) return res.send('{ \"status\": "fail", \"message\": "No Status" }');

	var query = "UPDATE salesforce.call_visit__c SET ";
	query += "Name = '" + req.body.name + "', ";
	query += "Account__c = '" + req.body.account + "', ";
	query += "Salesman__c = '" + req.body.salesman + "', ";
	query += "Plan_Start__c = '" + req.body.start + "', ";
	query += "Plan_End__c = '" + req.body.end + "', ";
	query += "Call_Type__c = '" + req.body.calltype + "', ";
	query += "Status__c = '" + req.body.status + "', ";
	query += "Comment__c = '" + req.body.comment + "', ";
	//query += "Check_In_Time__c = '" + req.body.date + "', ";
	//query += "Check_In_Location__Latitude__s = '" + req.body.date + "', ";
	//query += "Check_In_Location__Longitude__s = '" + req.body.date + "', ";
	//query += "Check_Out_Time__c = '" + req.body.date + "', ";
	//query += "Check_Out_Location__Latitude__s = '" + req.body.date + "', ";
	//query += "Check_Out_Location__Longitude__s = '" + req.body.date + "', ";
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

exports.updateCallVisitList = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);

	var haveRecord = false;
	var query = "UPDATE salesforce.call_visit__c SET ";
	query += "Name = '" + req.body.name + "', ";
	query += "Account__c = d.Account__c, Salesman__c = d.Salesman__c, Plan_Start__c = d.Plan_Start__c, Plan_End__c = d.Plan_End__c, ";
	query += "Call_Type__c = d.Call_Type__c, Status__c = d.Status__c, Comment__c = d.Comment__c, ";
	query += "systemmodstamp = CURRENT_TIMESTAMP from (values ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		if(req.body[i].account != null && req.body[i].salesman != null && req.body[i].start != null &&
		   req.body[i].end != null && req.body[i].calltype != null && req.body[i].status != null)
		{
			query += "('" + req.body[i].sfid + "', '" + req.body[i].name + "', '";
			query += req.body[i].account + "', '" + req.body[i].salesman + "', '" + req.body[i].start + "', '";
			query += req.body[i].end + "', '" + req.body[i].calltype + "', '" + req.body[i].status + "', '";
			query += req.body[i].comment + "' ";
			query += "), ";
			haveRecord = true;
		}
	}
	if(haveRecord == true)
	{
		query = query.substr(0, query.length - 2);
		query += ") as d(sfid, Name, Account__c, Salesman__c, Plan_Start__c, Plan_End__c, Call_Type__c, ";
		query += "Status__c, Comment__c ) WHERE o.sfid = d.sfid";
		console.log(query);

		db.select(query)
		.then(function(results) {
			res.send('{ \"status\": "success" }');
		})
		.catch(next);
	}
	else { res.send('{ \"status\": "no data" }'); }
};

exports.deleteCallVisit = function(req, res, next) {
	var id = req.params.id;
	//var query = "DELETE FROM salesforce.call_visit__c WHERE sfid = '" + id + "'";	
	var query = "UPDATE salesforce.call_visit__c SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid ='" + id + "'"; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.deleteCallVisitList = function(req, res, next) {
	var visitList = "(";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		visitList += "'" + req.body[i].sfid + "', ";
	}
	visitList = visitList.substr(0, visitList.length - 2);
	visitList += ")";
	//var query = "DELETE FROM salesforce.call_visit__c WHERE sfid IN " + visitList;	
	var query = "UPDATE salesforce.call_visit__c SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid IN " + visitList; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.getList = function(req, res, next) {
	var head = req.headers['authorization'];
	var limit = req.headers['limit'];
	var start = req.headers['start'];
	var startdate = req.headers['start-date'];
	
	db.init()
  	.then(function(conn) {
		auth.authen(head, conn)
		.then(function(obj) {
			var sales = obj.nickname;
			var sales = obj.nickname;
			var query = "SELECT * FROM salesforce.call_visit__c WHERE LOWER(salesman__c) = '" + sales;
			if(startdate != null)
			{
				query += " and createddate > '" + startdate;
			}
			query += "' Order by Plan_Start__c asc ";
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
				var output = '[';
				for(var i = 0 ; i < results.length ; i++)
				{
					output += '{"sfid":"' + results[i].sfid;
					output += '", "Name":"' + results[i].name;
					output += '", "Account":"' + results[i].account__c;
					output += '", "Start":"' + results[i].plan_start__c;
					output += '", "End":"' + results[i].plan_end__c;
					output += '", "Type":"' + results[i].call_type__c;
					output += '", "Status":"' + results[i].status__c;
					output += '", "Comment":"' + results[i].comment;
					output += '", "IsDeleted":' + results[i].isdeleted;
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
		}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"00", "errormessage":"Authen Fail." }'); })	
	}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"02", "errormessage":"initial Database fail." }'); })
};

exports.createCallVisit2 = function(req, res, next) {
	var head = req.headers['authorization'];
	if (!req.body) return res.sendStatus(400);

	auth.authen(head)
	.then(function(results) {
		sf.authen()
		.then(function(results2) {
			sf.createCallVisit(req.body, results2.token_type + ' ' + results2.access_token)
			.then(function(results3) {
				var query = "INSERT INTO salesforce.call_visit__c ( Name, Account__c, Salesman__c, Plan_Start__c, ";
				query += "Plan_End__c, Call_Type__c, Status__c, createddate, systemmodstamp, ";
				query += "IsDeleted ) VALUES ('";
				query += req.body.Name + "', '" + req.body.Account__c + "', '" + results.nickname + "', '";
				query += req.body.Plan_Start__c.toISOString() + "', '" + req.body.Plan_End__c.toISOString() + "', 'Unplanned', 'On Plan', ";
				query += "CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
				console.log(query);

				db.select(query)
				.then(function(results) {
					res.send('{ \"status\": "success" }');
				})
				.catch(next);
			})
			.catch(next);
		})
		.catch(next);
	}, function(err) { res.status(887).send("{ \"status\": \"fail\" }"); })	
};

exports.updateCallVisit2 = function(req, res, next) {
	var id = req.params.id;
	var head = req.headers['authorization'];
	if (!req.body) return res.sendStatus(400);

	auth.authen(head)
	.then(function(results) {
		sf.authen()
		.then(function(results2) {
			sf.updateCallVisit(id, req.body, results2.token_type + ' ' + results2.access_token)
			.then(function(results3) {
				var query = "UPDATE salesforce.call_visit__c SET ";
				query += "Name = '" + req.body.Name + "', ";
				query += "Plan_Start__c = '" + req.body.Plan_Start__c.toISOString() + "', ";
				query += "Plan_End__c = '" + req.body.Plan_End__c.toISOString() + "', ";
				query += "Comment__c = '" + req.body.Comment__c + "', ";
				query += "systemmodstamp = CURRENT_TIMESTAMP ";
				query += "WHERE sfid = '" + id + "'";
				console.log(query);

				db.select(query)
				.then(function(results) {
					res.send('{ \"status\": "success" }');
				})
				.catch(next);
			})
			.catch(next);
		})
		.catch(next);
	}, function(err) { res.status(887).send("{ \"status\": \"fail\" }"); })	
};
