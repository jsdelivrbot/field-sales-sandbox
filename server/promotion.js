var db = require('./pghelper');
var auth = require('./auth0');

exports.createPromotion = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
  
	var query = "INSERT INTO salesforce.Promotion__c ( sfid, guid, Name, Start_Date__c, End_Date__c, Description__c, URL__c, ";
	query += "createddate, systemmodstamp, IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.guid + "', '" + req.body.name + "', '" + req.body.start + "', '" + req.body.end + "', '" + req.body.desc + "', '";
	query += req.body.url + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.updatePromotion = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);
  
	var query = "UPDATE salesforce.Promotion__c SET ";
	query += "Name = '" + req.body.name + "', ";
	query += "Start_Date__c = '" + req.body.start + "', ";
	query += "End_Date__c = '" + req.body.end + "', ";
	query += "Description__c = '" + req.body.desc + "', ";
	query += "URL__c = '" + req.body.url + "', ";
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

exports.deletePromotion = function(req, res, next) {
	var id = req.params.id;
	//var query = "DELETE FROM salesforce.Promotion__c WHERE sfid = '" + id + "'";	
	var query = "UPDATE salesforce.Promotion__c SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid ='" + id + "'"; 
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
	
	auth.authen(head)
	.then(function(obj) {
		var query = "SELECT * FROM salesforce.promotion__c ";
		if(startdate != null)
		{
			query += "WHERE createddate > '" + startdate;
		}
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
				output += '", "Dtart":"' + results[i].start_date__c;
				output += '", "End":"' + results[i].end_date__c;
				output += '", "Description":"' + results[i].description__c;
				output += '", "Url":"' + results[i].url__c;
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
	}, function(err) { res.status(887).send("{ \"status\": \"fail\" }"); })
};
