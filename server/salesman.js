var db = require('./pghelper');

exports.createSalesman = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	var query = "INSERT INTO salesforce.Salesman__c ( sfid, Name, IMEI__c, Area_Code__c, Code__c, Email__c, Phone__c ) VALUES '";
	
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "(" + req.body[i].sfid + "', '" + req.body[i].name + "', '" + req.body[i].imei + "', '" + req.body[i].areacode;
		query += "', '" + req.body[i].code + "', '" + req.body[i].email + "', '" + req.body[i].phone + "'),";
	}
	query = query.substr(0, query.length - 1);
	console.log(query);
	/*
	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "create salesman success" }');
	})
	.catch(next);
	*/
	res.send(query);
};

exports.getInfo = function(req, res, next) {
	var deviceId =  req.params.id;
	var output = '';
	db.select("SELECT * FROM salesforce.Salesman__c WHERE IMEI__c ='" + deviceId + "'")
	.then(function(results) {
		console.log(results);	
		output = '[{"sfid":"' + results[0].sfid;
		output += '", "Name":"' + results[0].name;
		output += '", "IMEI__c":"' + results[0].imei__c;
		output += '", "Area_Code__c":"' + results[0].area_code__c;
		output += '", "Code__c":"' + results[0].code__c;
		output += '", "Email__c":"' + results[0].email__c;
		output += '", "Phone__c":"' + results[0].phone__c + '"}]';;
		console.log(output);
		res.json(JSON.parse(output));
	})
	.catch(next);
};

exports.updateSalesman = function(req, res, next) {
	var id = req.params.id;
	//console.log(id);
	if (!req.body) return res.sendStatus(400);
	var query = "UPDATE salesforce.Salesman__c SET ";
	query += "Name = '" + req.body.name + "', ";
	query += "IMEI__c = '" + req.body.imei + "', ";
	query += "Area_Code__c = '" + req.body.areacode + "', ";
	query += "Code__c = '" + req.body.code + "', ";
	query += "Email__c = '" + req.body.email + "', ";
	query += "Phone__c = '" + req.body.phone + "' ";
	query += "WHERE sfid = '" + id + "'";
	console.log(query);
	
	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "update salesman success" }');
	})
	.catch(next);
};

exports.deleteSalesman= function(req, res, next) {
	var id = req.params.id;
	var query = "DELETE FROM salesforce.Salesman__c WHERE sfid = '" + id + "'";	
	console.log(query);
	
	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "delete salesman success" }');
	})
	.catch(next);
};
