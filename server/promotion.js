var db = require('./pghelper');

exports.createPromotion = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
  
	var query = "INSERT INTO salesforce.Promotion__c ( sfid, Name, Start_Date__c, End_Date__c, Description__c, URL__c, ";
	query += "createddate, systemmodstamp, IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.name + "', '" + req.body.start + "', '" + req.body.end + "', '" + req.body.desc + "', '";
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
	
	res.send("Promotion");	
};
