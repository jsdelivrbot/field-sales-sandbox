var db = require('./pghelper');

exports.createSalesman = function(req, res, next) {
  if (!req.body) return res.sendStatus(400);
  var query = "INSERT INTO salesforce.Salesman__c ( sfid, Name, IMEI__c, Area_Code__c, Code__c, Email__c, Phone__c ) VALUES ('";
  query += req.body.sfid + "', '" + req.body.name + "', '" + req.body.imei + "', '" + req.body.areacode + "', '" + req.body.code + "', '";
  query += req.body.email + "', '" + req.body.phone + "')";
  console.log(query);
	
	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "create salesman success" }');
	})
	.catch(next);
};

exports.getInfo = function(req, res, next) {
  var deviceId = req.headers['deviceid'];
  db.select("SELECT * FROM salesforce.Salesman__c WHERE IMEI__c ='" + deviceId + "'")
  .then(function(results) {
    console.log(results);	
    res.json(results);
  })
  .catch(next);
};

exports.updateAccount = function(req, res, next) {
	var id = req.params.id;
	//console.log(id);
	if (!req.body) return res.sendStatus(400);
	var query = "UPDATE salesforce.Salesman__c SET ";
	query += "Name = '" + req.body.name + "', ";
	query += "IMEI__c = '" + req.body.imei + "', ";
	query += "Area_Code__c = '" + req.body.areacode + "', ";
	query += "Code__c = '" + req.body.code + "', ";
	query += "Email__c = '" + req.body.email + "', ";
	query += "Phone__c = '" + req.body.phone + "', ";
	query += "WHERE sfid = '" + id + "'";
	console.log(query);
	
	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "update success" }');
	})
	.catch(next);
};
