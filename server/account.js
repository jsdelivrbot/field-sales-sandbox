var db = require('./pghelper');
var sf = require('./salesforce');
var auth = require('./auth0');

exports.getList = function(req, res, next) {
	var head = req.headers['authorization'];
	var limit = req.headers['limit'];
	var start = req.headers['start'];
	var startdate = req.headers['start-date'];
	
	auth.authen(head)
	.then(function(obj) {
		var sales = obj.nickname;
		var query = "SELECT * FROM salesforce.Account WHERE sfid IN ";
		query += "(SELECT account__c FROM salesforce.account_team__c WHERE LOWER(salesman__c) = '" + sales + "'";
		if(startdate != null)
		{
			query += " and createddate > '" + startdate;
		}
		query += "' ) Order by accountnumber asc";
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
			if(results.length > 0)
			{
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
								output += '", "Address No":"' + results[i].address_no__c;
								output += '", "Address":"' + results[i].address__c;
								output += '", "Kwang":"' + results[i].kwang__c;
								output += '", "Khet":"' + results[i].khet__c;
								output += '", "Province":"' + results[i].province__c;
								output += '", "Zip":"' + results[i].zip__c;
								output += '", "Country":"' + results[i].country__c;
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
			} else { res.send("{ \"status\": \"No Account\" }"); }
		})
		.catch(next);      
	}, function(err) { res.status(887).send("{ \"status\": \"fail\" }"); })
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
		output += '", "Address":"' + results[0].address__c;
		output += '", "Kwang":"' + results[0].kwang__c;
		output += '", "Khet":"' + results[0].khet__c;
		output += '", "Province":"' + results[0].province__c;
		output += '", "Zip":"' + results[0].zip__c;
		output += '", "Country":"' + results[0].country__c;
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
	
	var query = "INSERT INTO salesforce.Account ( sfid, Name, Account_Name_2__c, Account_Name_3__c, Account_Name_4__c, AccountNumber, ";
	query += "Address_No__c, Address__c, Kwang__c, Khet__c, Province__c, Zip__c, Country__c, ";
	query += "Billing_Information__c, Credit_Limit__c, Fax, Fax_Ext__c, Phone, Price_Book__c, Sales_District__c, Tax_Number__c, ";
	query += "Industry_Name__c, Industry_Code_Name__c, Main_Contact_Name__c, Payment_Term_Name__c, Region_Name__c, Sales_District_Name__c, ";
	query += "guid, createddate, systemmodstamp, ";
	query += "IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.name + "', '" + req.body.name2 + "', '" + req.body.name3 + "', '" + req.body.name4 + "', '";
	query += req.body.accountnumber + "', '" + req.body.addressno + "', '" + req.body.address + "', '";
	query += req.body.kwang + "', '" + req.body.khet + "', '" + req.body.province + "', '" + req.body.zip + "', '";
	query += req.body.country + "', '" + req.body.billinfo + "', " + req.body.creditlimit + ", '";
	query += req.body.fax + "', '" + req.body.faxext + "', '" + req.body.phone + "', '" + req.body.pricebook + "', '";
	query += req.body.salesdistrict + "', '" + req.body.taxnumber + "', '" + req.body.industry + "', '" + req.body.subindustry + "', '";
	query += req.body.maincontact + "', '" + req.body.paymentterm + "', '" + req.body.region + "', '" + req.body.salesdistrictname + "', '";
	query += req.body.sfid + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
	console.log(query);
	
	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.createAccountList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	
	var query = "INSERT INTO salesforce.Account ( sfid, guid, Name, Account_Name_2__c, Account_Name_3__c, Account_Name_4__c, AccountNumber, ";
	query += "Address_No__c, Address__c, Kwang__c, Khet__c, Province__c, Zip__c, Country__c, ";
	query += "Credit_Limit__c, Fax, Fax_Ext__c, Phone, Price_Book__c, Sales_District__c, Tax_Number__c, ";
	query += "Industry_Name__c, Industry_Code_Name__c, Main_Contact_Name__c, Payment_Term_Name__c, Region_Name__c, Sales_District_Name__c, ";
	query += "createddate, systemmodstamp, ";
	query += "IsDeleted ) VALUES ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].sfid + "', '" + req.body[i].name + "', '" + req.body[i].name2 + "', '" + req.body[i].name3 + "', '" + req.body[i].name4 + "', '";
		query += req.body[i].accountnumber + "', '" + req.body[i].addressno + "', '" + req.body[i].address + "', '";
		query += req.body[i].kwang + "', '" + req.body[i].khet + "', '" + req.body[i].province + "', '" + req.body[i].zip + "', '";
		query += req.body[i].country + "', " + req.body[i].creditlimit + ", '";
		query += req.body[i].fax + "', '" + req.body[i].faxext + "', '" + req.body[i].phone + "', '" + req.body[i].pricebook + "', '";
		query += req.body[i].salesdistrict + "', '" + req.body[i].taxnumber + "', '" + req.body[i].industry + "', '" + req.body[i].subindustry + "', '";
		query += req.body[i].maincontact + "', '" + req.body[i].paymentterm + "', '" + req.body[i].region + "', '" + req.body[i].salesdistrictname + "', ";
		query += "CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false), ";
	}
	if(req.body.length > 0 )
	{
		query = query.substr(0, query.length - 2);
		console.log(query);

		db.select(query)
		.then(function(results) {
			res.send('{ \"status\": "success" }');
		}, function(err) { res.send('{ "success": "false", "errorcode" :"A01", "errormessage":"Insert Fail" }'); })
	}
	else
	{
		res.send('{ \"status\": "no data" }');
	}
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
	query += "AccountNumber = '" + req.body.accountnumber + "', ";
	query += "Address_No__c = '" + req.body.addressno + "', ";
	query += "Address__c = '" + req.body.address + "', ";
	query += "Kwang__c = '" + req.body.kwang + "', ";
	query += "Khet__c = '" + req.body.khet + "', ";
	query += "Province__c = '" + req.body.province + "', ";
	query += "Zip__c = '" + req.body.zip + "', ";
	query += "Country__c = '" + req.body.country + "', ";
	query += "Billing_Information__c = '" + req.body.billinfo + "', ";
	query += "Credit_Limit__c = " + req.body.creditlimit + ", ";
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
	query += "Sales_District_Name__c = '" +  req.body.salesdistrictname + "', ";
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

exports.updateAccountList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
		
	var query = "UPDATE salesforce.Account as o SET ";
	query += "Name = d.Name, Account_Name_2__c = d.Account_Name_2__c, Account_Name_3__c = d.Account_Name_3__c, ";
	query += "Account_Name_4__c = d.Account_Name_4__c, AccountNumber = d.AccountNumber, ";
	query += "Address_No__c = d.Address_No__c, Address__c = d.Address__c, Kwang__c = d.Kwang__c, Khet__c = d.Khet__c, ";
	query += "Province__c = d.Province__c, Zip__c = d.Zip__c, Country__c = d.Country__c, ";
	query += "Credit_Limit__c = d.Credit_Limit__c, Fax = d.Fax, ";
	query += "Fax_Ext__c = d.Fax_Ext__c, Phone = d.Phone, Price_Book__c = d.Price_Book__c, Sales_District__c = d.Sales_District__c, ";
	query += "Tax_Number__c = d.Tax_Number__c, Industry_Code_Name__c = d.Industry_Code_Name__c, ";
	query += "Industry_Name__c = d.Industry_Name__c, Main_Contact_Name__c = d.Main_Contact_Name__c, ";
	query += "Payment_Term_Name__c = d.Payment_Term_Name__c, Region_Name__c = d.Region_Name__c, ";
	query += "Sales_District_Name__c = d.Sales_District_Name__c, ";
	query += "systemmodstamp = CURRENT_TIMESTAMP ";
	query += 'from (values ';
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].name + "', '" + req.body[i].name2 + "', '" + req.body[i].name3 + "', '" + req.body[i].name4 + "', '";
		query += req.body[i].accountnumber + "', '" + req.body[i].addressno + "', '" + req.body[i].address + "', '";
		query += req.body[i].kwang + "', '" + req.body[i].khet + "', '" + req.body[i].province + "', '" + req.body[i].zip + "', '";
		query += req.body[i].country + "', " + req.body[i].creditlimit + ", '";
		query += req.body[i].fax + "', '" + req.body[i].faxext + "', '" + req.body[i].phone + "', '" + req.body[i].pricebook + "', '";
		query += req.body[i].salesdistrict + "', '" + req.body[i].taxnumber + "', '" + req.body[i].industry + "', '" + req.body[i].subindustry + "', '";
		query += req.body[i].maincontact + "', '" + req.body[i].paymentterm + "', '" + req.body[i].region + "', '" + req.body[i].salesdistrictname + "', '";
		query += "'), ";
	}
	if(req.body.length > 0)
	{
		query = query.substr(0, query.length - 2);
		query += ") as d(sfid, Name, Account_Name_2__c, Account_Name_3__c, Account_Name_4__c, AccountNumber, Address_No__c, ";
		query += "Address__c, Kwang__c, Khet__c, Province__c, Zip__c, Country__c, Credit_Limit__c, Fax, ";
		query += "Fax_Ext__c, Phone, Price_Book__c, Sales_District__c, Tax_Number__c, Industry_Code_Name__c, Industry_Name__c, ";
		query += "Main_Contact_Name__c, Payment_Term_Name__c, Region_Name__c, Sales_District_Name__c ";
		query += ") WHERE o.sfid = d.sfid";
		console.log(query);

		db.select(query)
		.then(function(results) {
			res.send('{ \"status\": "success" }');
		}, function(err) { res.send('{ "success": "false", "errorcode" :"A02", "errormessage":"Update Fail" }'); })
	}
	else
	{
		res.send('{ \"status\": "no data" }');
	}
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

exports.deleteAccountList = function(req, res, next) {
	var accountList = "(";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		accountList += "'" + req.body[i].sfid + "', ";
	}
	accountList = accountList.substr(0, accountList.length - 2);
	accountList += ")";
	//var query = "DELETE FROM salesforce.Account WHERE sfid = '" + id + "'";	
	var query = "UPDATE salesforce.Account SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid IN " + accountList; 
	console.log(query);
	
	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.updateAccount2 = function(req, res, next) {
	var id = req.params.id;
	var head = req.headers['authorization'];
	if (!req.body) return res.sendStatus(400);
		
	auth.authen(head)
	.then(function(results) {
		console.log(results.nickname);
		sf.authen()
		.then(function(results2) {
			var data = { 'Name': req.body.name };
			if(req.body.addressno != null) data.Address_No__c = req.body.addressno;
			if(req.body.address != null) data.Address__c = req.body.address;
			if(req.body.kwang != null) data.Kwang__c = req.body.kwang;
			if(req.body.khet != null) data.Khet__c = req.body.khet;
			if(req.body.province != null) data.Province__c = req.body.province;
			if(req.body.zip != null) data.Zip__c = req.body.zip;
			if(req.body.country != null) data.Country__c = req.body.country;
			if(req.body.fax != null) data.Fax = req.body.fax;
			if(req.body.faxext != null) data.Fax_Ext__c = req.body.faxext;
			if(req.body.phone != null) data.Phone = req.body.phone;
			sf.updateAccount(id, data, results2.token_type + ' ' + results2.access_token)
			.then(function(results3) {/*
				var query = "UPDATE salesforce.Account SET ";
				if(req.body.name != null) query += "Name = '" + req.body.name + "', ";
				if(req.body.addressno != null) query += "Address_No__c = '" + req.body.addressno + "', ";
				if(req.body.address != null) query += "Address__c = '" + req.body.address + "', ";
				if(req.body.kwang != null) query += "Kwang__c = '" + req.body.kwang + "', ";
				if(req.body.khet != null) query += "Khet__c = '" + req.body.khet + "', ";
				if(req.body.province != null) query += "Province__c = '" + req.body.province + "', ";
				if(req.body.zip != null) query += "Zip__c = '" + req.body.zip + "', ";
				if(req.body.country != null) query += "Country__c = '" + req.body.country + "', ";
				if(req.body.fax != null) query += "Fax = '" + req.body.fax + "', ";
				if(req.body.faxext != null) query += "Fax_Ext__c = '" + req.body.faxext + "', ";
				if(req.body.phone != null) query += "Phone = '" + req.body.phone + "', ";
				if(req.body.maincontact != null) query += "Main_Contact_Name__c = '" +  req.body.maincontact + "', ";
				if(req.body.isdeleted != null) query += "Isdeleted = '" + req.body.isdeleted +"', ";
				query += "systemmodstamp = CURRENT_TIMESTAMP ";
				query += "WHERE sfid = '" + id + "'";
				console.log(query);

				db.select(query)
				.then(function(results) {
					res.send('{ \"status\": "success" }');
				})
				.catch(next);*/
				res.send('{ \"status\": "success" }');
			})
			.catch(next);
		})
		.catch(next);
	}, function(err) { res.status(887).send("{ \"status\": \"fail\" }"); })	
};
