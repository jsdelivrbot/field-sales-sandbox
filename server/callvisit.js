var db = require('./pghelper');

exports.createCallVisit = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);

	var query = "INSERT INTO salesforce.call_visit__c ( sfid, Name, Account__c, Salesman__c, Plan_Start__c, ";
	query += "Plan_End__c, Call_Type__c, Status__c, Comment__c, createddate, systemmodstamp, ";
	query += "IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.name + "', '" + req.body.account + "', '" + req.body.salesman + "', '";
	query += req.body.start + "', '" + req.body.end + "', '" + req.body.calltype + "', '" + req.body.status;
	query += req.body.comment + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.updateCallVisit = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);

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

exports.getList = function(req, res, next) {
	var head = req.headers['authorization'];
	var limit = req.headers['limit'];
	var start = req.headers['start'];
	var startdate = req.headers['start-date'];
	
	var https = require('https');
	var options = {
		host: 'app98692077.auth0.com',
		path: '/userinfo',
		port: '443',
		method: 'GET',
		headers: { 'authorization': head }
	};

	callback = function(results) {
		var str = '';
		results.on('data', function(chunk) {
			str += chunk;
		});
		results.on('end', function() {
			try {
				console.log(str);
				var obj = JSON.parse(str);
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
			}
			catch(ex) { res.status(887).send("{ \"status\": \"fail\" }"); }
		});
	}
			
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();	
};

exports.createCallVisit2 = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);

	var query = "INSERT INTO salesforce.call_visit__c ( Name, Account__c, Salesman__c, Plan_Start__c, ";
	query += "Plan_End__c, Call_Type__c, Status__c, Comment__c, createddate, systemmodstamp, ";
	query += "IsDeleted ) VALUES ('";
	query += req.body.name + "', '" + req.body.account + "', '" + req.body.salesman + "', '";
	query += req.body.start + "', '" + req.body.end + "', 'Unplanned', '" + req.body.status;
	query += req.body.comment + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
