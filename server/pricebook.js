var db = require('./pghelper');

exports.createPricebook = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	
	var query = "INSERT INTO salesforce.pricebook2 ( sfid, guid, Name, Description, IsActive, createddate, systemmodstamp, ";
	query += "IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.sfid + "', '" + req.body.name + "', '" + req.body.description + "', '";
	query += req.body.active + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.createPricebookList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	
	var query = "INSERT INTO salesforce.pricebook2 ( sfid, guid, Name, Description, IsActive, createddate, systemmodstamp, ";
	query += "IsDeleted ) VALUES ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].sfid + "', '" + req.body[i].name + "', '" + req.body[i].description + "', '";
		query += req.body[i].active + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false), ";
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

exports.updatePricebook = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);
  	
	var query = "UPDATE salesforce.pricebook2 SET ";
	query += "Name = '" + req.body.name + "', ";
	query += "Description = '" + req.body.description + "', ";
	query += "IsActive = '" + req.body.active + "', ";
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

exports.updatePricebookList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
  	
	var query = "UPDATE salesforce.pricebook2 as o SET ";
	query += "Name = d.Name, Description = d.Description, IsActive = d.IsActive, ";
	query += "systemmodstamp = CURRENT_TIMESTAMP from (values ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', " + req.body[i].name + "', " + req.body[i].description + "', ";
		query += req.body[i].active + "' ";
		query += "), ";
	}
	if(req.body.length > 0)
	{
		query = query.substr(0, query.length - 2);
		query += ") as d(sfid, Name, Description, IsActive) WHERE o.sfid = d.sfid";
		console.log(query);

		db.select(query)
		.then(function(results) {
			res.send('{ \"status\": "success" }');
		})
		.catch(next);
	}
	else { res.send('{ \"status\": "no data" }'); }
};

exports.deletePricebook = function(req, res, next) {
	var id = req.params.id;
  	//var query = "DELETE FROM salesforce.pricebook2 WHERE sfid = '" + id + "'";	
	var query = "UPDATE salesforce.pricebook2 SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid ='" + id + "'"; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.deletePricebookList = function(req, res, next) {
	var pricebookList = "(";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		pricebookList += "'" + req.body[i].sfid + "', ";
	}
	pricebookList = pricebookList.substr(0, pricebookList.length - 2);
	pricebookList += ")";
  	//var query = "DELETE FROM salesforce.pricebook2 WHERE sfid IN " + pricebookList;	
	var query = "UPDATE salesforce.pricebook2 SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid IN " + pricebookList; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
