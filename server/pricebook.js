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
