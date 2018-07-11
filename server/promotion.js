var db = require('./pghelper');
var auth = require('./auth0');

exports.createPromotion = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
  
	var query = "INSERT INTO salesforce.Promotion__c ( sfid, guid, Name, Start_Date__c, End_Date__c, Description__c, URL__c, ";
	query += "createddate, systemmodstamp, IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.guid + "', '" + req.body.name + "', '" + req.body.start + "', '"
	query += req.body.end + "', '" + req.body.description + "', '";
	query += req.body.url + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.createPromotionList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
  
	var query = "INSERT INTO salesforce.Promotion__c ( sfid, guid, Name, Start_Date__c, End_Date__c, Description__c, URL__c, ";
	query += "createddate, systemmodstamp, IsDeleted ) VALUES ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].guid + "', '" + req.body[i].name + "', '";
		query += req.body[i].start + "', '" + req.body[i].end + "', '" + req.body[i].description + "', '";
		query += req.body.url + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false), ";
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

exports.updatePromotion = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);
  
	var query = "UPDATE salesforce.Promotion__c SET ";
	query += "Name = '" + req.body.name + "', ";
	query += "Start_Date__c = '" + req.body.start + "', ";
	query += "End_Date__c = '" + req.body.end + "', ";
	query += "Description__c = '" + req.body.description + "', ";
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

exports.updatePromotionList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
  
	var query = "UPDATE salesforce.Promotion__c as o SET ";
	query += "Name = d.Name, Start_Date__c = d.Start_Date__c, End_Date__c = d.End_Date__c, Description__c = d.Description__c, ";
	query += "URL__c = d.URL__c, ";
	query += "systemmodstamp = CURRENT_TIMESTAMP from (values ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].name + "', '" + req.body[i].start + "', '";
		query += req.body[i].end + "', '" + req.body[i].description + "', '" + req.body[i].url + "' ";
		query += "), ";
	}
	if(req.body.length > 0)
	{
		query = query.substr(0, query.length - 2);
		query += ") as d(sfid, Name, Start_Date__c, End_Date__c, Description__c, URL__c ";
		query += ") WHERE o.sfid = d.sfid";
		console.log(query);

		db.select(query)
		.then(function(results) {
			res.send('{ \"status\": "success" }');
		})
		.catch(next);
	}
	else { res.send('{ \"status\": "no data" }'); }
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

exports.deletePromotionList = function(req, res, next) {
	var promotionList = "(";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		promotionList += "'" + req.body[i].sfid + "', ";
	}
	promotionList = promotionList.substr(0, promotionList.length - 2);
	promotionList += ")";
	//var query = "DELETE FROM salesforce.Promotion__c WHERE sfid IN " + promotionList + "'";	
	var query = "UPDATE salesforce.Promotion__c SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid IN " + promotionList; 
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
