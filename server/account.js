var db = require('./pghelper');

exports.getList = function(req, res, next) {
	var head = req.headers['authorization'];
	var limit = req.headers['limit'];
	var start = req.headers['start'];
	
	var options = {
		host: 'app98692077.auth0.com',
		path: '/userinfo',
		port: '443',
		method: 'GET',
		headers: { 'Content-Type': 'application/json' }
	};

	callback = function(results) {
		var str = '';
		results.on('data', function(chunk) {
			str += chunk;
		});
		results.on('end', function() {
			try {
				var obj = JSON.parse(str);
				var sales = obj.nickname;
				var query = "SELECT * FROM salesforce.Account WHERE Salesman__c IN ";
				query += "(SELECT account__c FRON salesforce.account_team__c WHERE salesman__c = '" + sales + "' ) Order by Name asc";
				if(!isNaN(limit))
				{
					query += " limit " + limit;
				}
				if(!isNaN(start) && start != 0)
				{
					query += " OFFSET  " + start;
				}
				console.log(query);
				db.select(query)
				.then(function(results) {
					var output = '[';
					for(var i = 0 ; i <results.length ; i++)
					{
						output += '{"sfid":"' + results[i].sfid;
						output += '", "Name":"' + results[i].Name;
						output += '", "Tax_Number__c":"' + results[i].Tax_Number__c + '"},';
					}
					if(results.length)
					{
						output = output.substr(0, output.length - 1);
					}
					output+= ']';
					res.json(JSON.parse(output));
				})
				.catch(next);      
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

exports.getInfo = function(req, res, next) {
	var id = req.params.id;
	var output = '';
	db.select("SELECT * FROM salesforce.Account WHERE sfid='" + id + "'")
	.then(function(results) {
		console.log(results);
		output = '[{"sfid":"' + results[0].sfid;
		output += '", "Name":"' + results[0].name + results[0].account_name_2__c + results[0].account_name_3__c + results[0].account_name_4__c;
		output += '", "Salesman__c":"' + results[0].salesman__c;
		output += '", "AccountNumber":"' + results[0].accountnumber;
		output += '", "Address_No__c":"' + results[0].address_no__c;
		output += '", "BillingCity":"' + results[0].billingcity;
		output += '", "BillingCountry":"' + results[0].billingcountry;
		output += '", "BillingLatitude":"' + results[0].billinglatitude;
		output += '", "BillingLongitude":"' + results[0].billinglongitude;
		output += '", "BillingPostalCode":"' + results[0].billingpostalCode;
		output += '", "BillingState":"' + results[0].billingstate;
		output += '", "BillingStreet":"' + results[0].billingstreet;
		output += '", "Billing_Information__c":"' + results[0].billing_information__c;
		output += '", "Credit_Limit__c":"' + results[0].credit_limit__c;
		output += '", "Fax":"' + results[0].fax;
		output += '", "Fax_Ext__c":"' + results[0].fax_ext__c;
		output += '", "Phone":"' + results[0].phone;
		output += '", "Price_Book__c":"' + results[0].price_book__c;
		output += '", "Sales_District__c":"' + results[0].sales_district__c;
		output += '", "Tax_Number__c":"' + results[0].tax_number__c;
		output += '", "IsDeleted":"' + results[0].isdeleted + '"}]';
		console.log(output);
		res.json(JSON.parse(output));
	})
	.catch(next);
};

exports.createAccount = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	
	var query = "INSERT INTO salesforce.Account ( sfid, Name, Account_Name_2__c, Account_Name_3__c, Account_Name_4__c, Salesman__c, AccountNumber, ";
	query += "Address_No__c, BillingCity, BillingCountry, BillingLatitude, BillingLongitude, BillingPostalCode, BillingState, BillingStreet, ";
	query += "Billing_Information__c, Credit_Limit__c, Fax, Fax_Ext__c, Phone, Price_Book__c, Sales_District__c, Tax_Number__c, ";
	query += "createddate, systemmodstamp, ";
	query += "IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.name + "', '" + req.body.name2 + "', '" + req.body.name3 + "', '" + req.body.name4 + "', '";
	query += req.body.salesman + "', '" + req.body.accountnumber + "', '" + req.body.addressno + "', '" + req.body.city + "', '";
	query += req.body.country + "', '" + req.body.latitude + "', '" + req.body.longitude + "', '" + req.body.postalcode + "', '";
	query += req.body.stage + "', '" + req.body.street + "', '" + req.body.billinfo + "', '" + req.body.creditlimit + "', '";
	query += req.body.fax + "', '" + req.body.faxext + "', '" + req.body.phone + "', '" + req.body.pricebook + "', '";
	query += req.body.salesdistrict + "', '" + req.body.taxnumber + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
	console.log(query);
	
	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.updateAccount = function(req, res, next) {
	var id = req.params.id;
	//console.log(id);
	if (!req.body) return res.sendStatus(400);
		
	var query = "UPDATE salesforce.Account SET ";
	query += "Name = '" + req.body.name + "', ";
	query += "Account_Name_2__c = '" + req.body.name2 + "', ";
	query += "Account_Name_3__c = '" + req.body.name3 + "', ";
	query += "Account_Name_4__c = '" + req.body.name4 + "', ";
	query += "Salesman__c ='" + req.body.salesman + "', ";
	query += "AccountNumber = '" + req.body.accountnumber + "', ";
	query += "Address_No__c = '" + req.body.addressno + "', ";
	query += "BillingCity = '" + req.body.city + "', ";
	query += "BillingCountry = '" + req.body.country + "', ";
	query += "BillingLatitude = '" + req.body.latitude + "', ";
	query += "BillingLongitude = '" + req.body.longitude + "', ";
	query += "BillingPostalCode = '" + req.body.postalcode + "', ";
	query += "BillingState = '" + req.body.stage + "', ";
	query += "BillingStreet = '" + req.body.street + "', ";
	query += "Billing_Information__c = '" + req.body.billinfo + "', ";
	query += "Credit_Limit__c = '" + req.body.creditlimit + "', ";
	query += "Fax = '" + req.body.fax + "', ";
	query += "Fax_Ext__c = '" + req.body.faxext + "', ";
	query += "Phone = '" + req.body.phone + "', ";
	query += "Price_Book__c = '" + req.body.pricebook + "', ";
	query += "Sales_District__c = '" + req.body.salesdistrict + "', ";
	query += "Tax_Number__c = '" +  req.body.taxnumber + "', ";
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

exports.deleteAccount = function(req, res, next) {
	var id = req.params.id;
	//var query = "DELETE FROM salesforce.Account WHERE sfid = '" + id + "'";	
	var query = "UPDATE salesforce.Account SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid ='" + id + "'"; 
	console.log(query);
	
	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

