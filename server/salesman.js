var db = require('./pghelper');

exports.createSalesman = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);

	//Create User on Auth0
	var https = require('https');
	var postBody = JSON.stringify({      
		'client_id':'Ko42sNQ96ngSP1KTvs6FScGHPXThIwn6',
		'username':req.body.email,
		'email':req.body.email,
		'password':'1234',
		'connection':'Username-Password-Authentication'
	});
	var options = {
		host: 'app98692077.auth0.com',
		path: '/dbconnections/signup',
		port: '443',
		method: 'POST',
		headers: { 'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(postBody)
		}
	};

	callback = function(results) {
		var str = '';
		results.on('data', function(chunk) {
			str += chunk;
		});
		results.on('end', function() {
			try {
				var obj = JSON.parse(str);
				var query = "INSERT INTO salesforce.Salesman__c ( sfid, Name, IMEI__c, Area_Code__c, Code__c, Email__c, ";
				query += "Phone__c, User_Id__c, createddate, systemmodstamp, ";
				query += "IsDeleted ) VALUES ('";
				query += req.body.sfid + "', '" + req.body.name + "', '" + req.body.imei + "', '";
				query += req.body.areacode + "', '" + req.body.code + "', '" + req.body.email + "', '";
				query += obj._id + "', '" + req.body.phone;
				query += "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
				console.log(query);

				db.select(query)
				.then(function(results) {
					res.send('{ \"status\": "success", \"id\": ' + obj._id + '}');
				}).catch( function(error) {res.send(error);} );
			}
			catch(ex) { res.status(887).send("{ \"status\": \"fail\" }"); }
		});
	}
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
	//console.log(`problem with request: ${e.message}`);
		res.send('problem with request: ${e.message}');
	});
	httprequest.write(postBody);
	httprequest.end();	
};

exports.updateSalesman = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);
	var query = "UPDATE salesforce.Salesman__c as o SET ";
	query += "Name = '" + req.body.name + "', ";
	query += "IMEI__c = '" + req.body.imei + "', ";
	query += "Area_Code__c = '" + req.body.areacode + "', ";
	query += "Code__c = '" + req.body.code + "', ";
	query += "Email__c ='" + req.body.email + "', ";
	query += "Phone__c = '" + req.body.phone + "', ";
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
/*
exports.upsertSalesman = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	var haveNew = false;
	var haveUpdate = false
	var query = "INSERT INTO salesforce.Salesman__c ( sfid, Name, IMEI__c, Area_Code__c, Code__c, Email__c, Phone__c ) VALUES ";
	var query2 = "UPDATE salesforce.Salesman__c as o SET ";
	query2 += "Name = n.Name, ";
	query2 += "IMEI__c = n.IMEI__c, ";
	query2 += "Area_Code__c = n.Area_Code__c, ";
	query2 += "Code__c = n.Code__c, ";
	query2 += "Email__c = n.Email__c, ";
	query2 += "Phone__c = n.Phone__c ";
	query2 += "from (values";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		if(req.body[i].type == "New")
		{
			query += "('" + req.body[i].sfid + "', '" + req.body[i].name + "', '" + req.body[i].imei + "', '";
			query += req.body[i].areacode + "', '";
			query += req.body[i].code + "', '" + req.body[i].email + "', '" + req.body[i].phone + "'),";
			haveNew = true;
		}
		else if(req.body[i].type == "Update")
		{
			query2 += "('" + req.body[i].sfid + "', '" +  req.body[i].name + "', '" + req.body[i].imei + "', '";
			query2 += req.body[i].areacode + "', '" + req.body[i].code + "', '" + req.body[i].email + "', '"; 
			query2 += req.body[i].phone + "'),";
			haveUpdate = true;
		}
	}
	query = query.substr(0, query.length - 1);
	query2 = query2.substr(0, query2.length - 1);
	query2 += ") as n (sfid, Name, IMEI__c, Area_Code__c, Code__c, Email__c, Phone__c) ";
	query2 += "where n.sfid = o.sfid";
	console.log(query);
	console.log(query2);
	
	query3 = '';
	if(haveNew)
	{
		query3 += query + '; ';
	}
	if(haveUpdate)
	{
		query3 += query2;
	}
	db.select(query3)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch( function(error) {res.send(error);} );	
	//res.send(query + '\n ' + query2);
};
*/
exports.getInfo = function(req, res, next) {
	var deviceId =  req.params.id;
	var output = '';
	db.select("SELECT * FROM salesforce.Salesman__c WHERE IMEI__c ='" + deviceId + "' and IsDeleted = false")
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

exports.deleteSalesman= function(req, res, next) {
	var id = req.params.id;
	//var query = "DELETE FROM salesforce.Salesman__c WHERE sfid = '" + id + "'";	
	var query = "UPDATE salesforce.Salesman__c as o SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid = '" + id + "'";
	console.log(query);
	
	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
