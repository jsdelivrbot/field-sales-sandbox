var db = require('./pghelper');

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
				var query = "SELECT * FROM salesforce.Account WHERE sfid IN ";
				query += "(SELECT account__c FROM salesforce.account_team__c WHERE LOWER(salesman__c) = '" + sales + "'";
				if(startdate != null)
				{
					query += " and createddate > " + startdate;
				}
				query += " ) Order by accountnumber asc";
				if(!isNaN(limit) && limit > 0)
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
					var accountList = "(";
					for(var i = 0 ; i < results.length ; i++)
					{
						accountList += "'" + results[i].sfid + "', ";
					}
					accountList = accountList.substr(0, accountList.length - 2);
					accountList += ")";
					
					var query2 = "SELECT * FROM salesforce.Contact WHERE accountId IN " + accountList;
					console.log(query2);
					db.select(query2)
					.then(function(results2) {
						var query3 = "SELECT * FROM salesforce.Top_Store_Program__c WHERE account__c IN " + accountList;
						console.log(query3);
						db.select(query3)
						.then(function(results3) {
							var query4 = "SELECT * FROM salesforce.Product_History__c WHERE account__c IN " + accountList;
							console.log(query4);
							db.select(query4)
							.then(function(results4) {
								
								var output = '[';
								for(var i = 0 ; i < results.length ; i++)
								{
									output += '{"sfid":"' + results[i].sfid;
									output += '", "Name":"' + results[i].name + ' ' + results[i].account_name_2__c;
									output += ' ' + results[i].account_name_3__c + ' ' + results[i].account_name_4__c;
									output += '", "AccountNumber":"' + results[i].accountnumber;
									output += '", "Tax":"' + results[i].tax_number__c;
									output += '", "Phone":"' + results[i].phone;
									output += '", "Fax":"' + results[i].fax +'#' + results[i].fax_ext__c;
									output += '", "Credit":"' + results[i].credit_limit__c;
									output += '", "Address":"' + results[i].address_no__c + ' ' + results[i].billingstreet;
									output += ' ' + results[i].billingcity + ' ' + results[i].billingcountry;
									output += ' ' + results[i].billingpostalcode + ' ' + results[i].billingstate;
									output += '", "Lat":"' + results[i].billinglatitude;
									output += '", "Long":"' + results[i].billinglongitude;
									output += '", "Pricebook":"' + results[i].price_book__c;
									output += '", "Industry":"' + results[i].industry_name__c;
									output += '", "SubIndustry":"' + results[i].industry_code_name__c;
									output += '", "PaymentTerm":"' + results[i].payment_term_name__c;
									output += '", "Region":"' + results[i].region_name__c;
									output += '", "SalesDistrict":"' + results[i].sales_district_name__c;
									//Contact
									var contact = '[';
									for(var j = 0 ; j < results2.length ; j++)
									{
										if(results2[j].accountid == results[i].sfid)
										{
											contact += '{"sfid":"' + results2[j].sfid;
											contact += '", "Title":"' + results2[j].title;
											contact += '", "Name":"' + results2[j].name;
											contact += '", "Nickname":"' + results2[j].nickname__c;
											contact += '", "Department":"' + results2[j].department;
											contact += '", "Phone":"' + results2[j].phone;
											contact += '", "Fax":"' + results2[j].fax;
											contact += '", "Email":"' + results2[j].email;
											contact += '", "Birthdate":"' + results2[j].birthdate;
											contact += '", "Street":"' + results2[j].mailingstreet;
											contact += '", "City":"' + results2[j].mailingcity;
											contact += '", "Country":"' + results2[j].mailingcountry;
											contact += '", "PostalCode":"' + results2[j].mailingpsotalcode;
											contact += '", "Stage":"' + results2[j].mailingstage;
											contact += '", "IsDeleted":' + results2[j].isdeleted;
											contact += ', "systemmodstamp":"' + results2[j].systemmodstamp + '"},';
										}
									}
									if(contact.length > 1)
									{
										contact = contact.substr(0, contact.length - 1);
									}
									contact += ']';
									output += '", "Contact":' + contact;
									//Top Store Program
									var program = '[';
									for(var j = 0 ; j < results3.length ; j++)
									{
										if(results3[j].account__c == results[i].sfid)
										{
											program += '{"sfid":"' + results3[j].sfid;
											program += '", "Name":"' + results3[j].name;
											program += '", "Date":"' + results3[j].date__c;
											program += '", "Type":"' + results3[j].event_type__c;
											program += '", "IsDeleted":' + results3[j].isdeleted;
											program += ', "systemmodstamp":"' + results3[j].systemmodstamp + '"},';
										}
									}
									if(program.length > 1)
									{
										program = program.substr(0, program.length - 1);
									}
									program += ']';
									output += ', "Program":' + program;
									//Product History
									var history = '[';
									for(var j = 0 ; j < results4.length ; j++)
									{
										if(results4[j].account__c == results[i].sfid)
										{
											history += '{"sfid":"' + results4[j].sfid;
											history += '", "Product":"' + results4[j].product__c;
											history += '", "IsDeleted":' + results4[j].isdeleted;
											history += ', "systemmodstamp":"' + results4[j].systemmodstamp + '"},';
										}
									}
									if(history.length > 1)
									{
										history = history.substr(0, history.length - 1);	
									}
									history += ']';
									output += ', "History":' + history;
									output += ', "IsDeleted":' + results[i].isdeleted;
									output += ', "systemmodstamp":"' + results[i].systemmodstamp + '"},';
								}
								if(results.length)
								{
									output = output.substr(0, output.length - 1);
								}
								output += ']';
								console.log(output);
								res.json(JSON.parse(output));

								//res.send(JSON.stringify(results2));
								//res.send(JSON.stringify(results3));
								//res.send(JSON.stringify(results4));
							}) 
							.catch(next); 
						}) 
						.catch(next);  
					}) 
					.catch(next);  
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

exports.updateAccount2 = function(req, res, next) {
	var id = req.params.id;
	var head = req.headers['authorization'];
	if (!req.body) return res.sendStatus(400);
		
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
				query += "Industry_Code_Name__c = '" +  req.body.subindustry + "', ";
				query += "Industry_Name__c = '" +  req.body.industry + "', ";
				query += "Main_Contact_Name__c = '" +  req.body.maincontact + "', ";
				query += "Payment_Term_Name__c = '" +  req.body.paymentterm + "', ";
				query += "Region_Name__c = '" +  req.body.region + "', ";
				query += "Sales_District_Name__c = '" +  req.body.salesdistrict + "', ";
				query += "systemmodstamp = CURRENT_TIMESTAMP, ";
				query += "Isdeleted = '" + req.body.isdeleted +"' ";
				query += "WHERE sfid = '" + id + "'";
				console.log(query);

				db.select(query)
				.then(function(results) {
					res.send('{ \"status\": "success" }');
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
	query += "Industry_Name__c, Industry_Code_Name__c, Main_Contact_Name__c, Payment_Term_Name__c, Region_Name__c, Sales_District_Name__c, ";
	query += "createddate, systemmodstamp, ";
	query += "IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.name + "', '" + req.body.name2 + "', '" + req.body.name3 + "', '" + req.body.name4 + "', '";
	query += req.body.salesman + "', '" + req.body.accountnumber + "', '" + req.body.addressno + "', '" + req.body.city + "', '";
	query += req.body.country + "', '" + req.body.latitude + "', '" + req.body.longitude + "', '" + req.body.postalcode + "', '";
	query += req.body.stage + "', '" + req.body.street + "', '" + req.body.billinfo + "', '" + req.body.creditlimit + "', '";
	query += req.body.fax + "', '" + req.body.faxext + "', '" + req.body.phone + "', '" + req.body.pricebook + "', '";
	query += req.body.salesdistrict + "', '" + req.body.taxnumber + "', '" + req.body.industry + "', '" + req.body.subindustry + "', '";
	query += req.body.maincontact + "', '" + req.body.paymentterm + "', '" + req.body.region + "', '" + req.body.salesdistrict;
	query += "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
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
	query += "Industry_Code_Name__c = '" +  req.body.subindustry + "', ";
	query += "Industry_Name__c = '" +  req.body.industry + "', ";
	query += "Main_Contact_Name__c = '" +  req.body.maincontact + "', ";
	query += "Payment_Term_Name__c = '" +  req.body.paymentterm + "', ";
	query += "Region_Name__c = '" +  req.body.region + "', ";
	query += "Sales_District_Name__c = '" +  req.body.salesdistrict + "', ";
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

