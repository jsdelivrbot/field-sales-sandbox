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
		db.init()
  		.then(function(conn) {
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
			db.query(query, conn)
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
					db.query(query2, conn)
					.then(function(results2) {
						var query3 = "SELECT * FROM salesforce.Top_Store_Program__c WHERE account__c IN " + accountList;
						console.log(query3);
						db.query(query3, conn)
						.then(function(results3) {
							var query4 = "SELECT * FROM salesforce.Product_History__c WHERE account__c IN " + accountList;
							console.log(query4);
							db.query(query4, conn)
							.then(function(results4) {

								var output = '[';
								for(var i = 0 ; i < results.length ; i++)
								{
									output += '{"sfid":"' + results[i].sfid;
									output += '", "parent":"' + results[i].parentid;
									output += '", "name":"' + results[i].name + ' ' + results[i].account_name_2__c;
									output += ' ' + results[i].account_name_3__c + ' ' + results[i].account_name_4__c;
									output += '", "accountnumber":"' + results[i].accountnumber;
									output += '", "tax_number":"' + results[i].tax_number__c;
									output += '", "phone":"' + results[i].phone;
									output += '", "fax":"' + results[i].fax +'#' + results[i].fax_ext__c;
									output += '", "credit_limit":"' + results[i].credit_limit__c;
									output += '", "address_no":"' + results[i].address_no__c;
									output += '", "address":"' + results[i].address__c;
									output += '", "kwang":"' + results[i].kwang__c;
									output += '", "khet":"' + results[i].khet__c;
									output += '", "province":"' + results[i].province__c;
									output += '", "zip":"' + results[i].zip__c;
									output += '", "country":"' + results[i].country__c;
									output += '", "pricebook":"' + results[i].price_book__c;
									output += '", "industry":"' + results[i].industry_name__c;
									output += '", "sub_industry":"' + results[i].industry_code_name__c;
									output += '", "payment_term":"' + results[i].payment_term_name__c;
									output += '", "region":"' + results[i].region_name__c;
									output += '", "sales_district":"' + results[i].sales_district_name__c;
									//Contact
									var contact = '[';
									for(var j = 0 ; j < results2.length ; j++)
									{
										if(results2[j].accountid == results[i].sfid)
										{
											contact += '{"sfid":"' + results2[j].sfid;
											contact += '", "title":"' + results2[j].title;
											contact += '", "name":"' + results2[j].name;
											contact += '", "nickname":"' + results2[j].nickname__c;
											contact += '", "department":"' + results2[j].department;
											contact += '", "phone":"' + results2[j].phone;
											contact += '", "fax":"' + results2[j].fax;
											contact += '", "email":"' + results2[j].email;
											contact += '", "birthdate":"' + results2[j].birthdate;
											contact += '", "street":"' + results2[j].mailingstreet;
											contact += '", "city":"' + results2[j].mailingcity;
											contact += '", "country":"' + results2[j].mailingcountry;
											contact += '", "postalcode":"' + results2[j].mailingpsotalcode;
											contact += '", "stage":"' + results2[j].mailingstage;
											contact += '", "isdeleted":' + results2[j].isdeleted;
											contact += ', "systemmodstamp":"' + results2[j].systemmodstamp + '"},';
										}
									}
									if(contact.length > 1)
									{
										contact = contact.substr(0, contact.length - 1);
									}
									contact += ']';
									output += '", "contact":' + contact;
									//Top Store Program
									var program = '[';
									for(var j = 0 ; j < results3.length ; j++)
									{
										if(results3[j].account__c == results[i].sfid)
										{
											program += '{"sfid":"' + results3[j].sfid;
											program += '", "name":"' + results3[j].name;
											program += '", "date":"' + results3[j].date__c;
											program += '", "type":"' + results3[j].event_type__c;
											program += '", "isdeleted":' + results3[j].isdeleted;
											program += ', "systemmodstamp":"' + results3[j].systemmodstamp + '"},';
										}
									}
									if(program.length > 1)
									{
										program = program.substr(0, program.length - 1);
									}
									program += ']';
									output += ', "program":' + program;
									//Product History
									var history = '[';
									for(var j = 0 ; j < results4.length ; j++)
									{
										if(results4[j].account__c == results[i].sfid)
										{
											history += '{"sfid":"' + results4[j].sfid;
											history += '", "product":"' + results4[j].product__c;
											history += '", "isdeleted":' + results4[j].isdeleted;
											history += ', "systemmodstamp":"' + results4[j].systemmodstamp + '"},';
										}
									}
									if(history.length > 1)
									{
										history = history.substr(0, history.length - 1);	
									}
									history += ']';
									output += ', "history":' + history;
									output += ', "isdeleted":' + results[i].isdeleted;
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
		}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"02", "errormessage":"initial Database fail." }'); })
	}, function(err) { res.status(887).send("{ \"status\": \"fail\" }"); })
};

exports.getInfo = function(req, res, next) {
	var id = req.params.id;
	var output = '';
	db.select("SELECT * FROM salesforce.Account WHERE sfid='" + id + "'")
	.then(function(results) {
		console.log(results);
		output = '[{"sfid":"' + results[0].sfid;
		output += '", "name":"' + results[0].name + results[0].account_name_2__c + results[0].account_name_3__c + results[0].account_name_4__c;
		output += '", "parent":"' + results[0].parentid;
		output += '", "accountnumber":"' + results[0].accountnumber;
		output += '", "address_no":"' + results[0].address_no__c;
		output += '", "address":"' + results[0].address__c;
		output += '", "kwang":"' + results[0].kwang__c;
		output += '", "khet":"' + results[0].khet__c;
		output += '", "province":"' + results[0].province__c;
		output += '", "zip":"' + results[0].zip__c;
		output += '", "country":"' + results[0].country__c;
		output += '", "billing_information":"' + results[0].billing_information__c;
		output += '", "credit limit":"' + results[0].credit_limit__c;
		output += '", "fax":"' + results[0].fax;
		output += '", "fax_ext":"' + results[0].fax_ext__c;
		output += '", "phone":"' + results[0].phone;
		output += '", "pricebook":"' + results[0].price_book__c;
		output += '", "sales_district":"' + results[0].sales_district_name__c;
		output += '", "tax_number":"' + results[0].tax_number__c;
		output += '", "industry":"' + results[0].industry_name__c;
		output += '", "sub_industry":"' + results[0].industry_code_name__c;
		output += '", "main_contact":"' + results[0].main_contact_name__c;
		output += '", "payment_term":"' + results[0].payment_term_name__c;
		output += '", "region":"' + results[0].region_name__c;
		output += '", "isdeleted":"' + results[0].isdeleted + '"}]';
		console.log(output);
		res.json(JSON.parse(output));
	})
	.catch(next);
};

exports.createAccount = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	if (req.body.pricebook == null) return res.send('{ \"status\": "fail", \"message\": "No Pricebook" }');
		
	req.body.name = req.body.name.replace(/'/g, "\''");
	req.body.name2 = req.body.name2.replace(/'/g, "\''");
	req.body.name3 = req.body.name3.replace(/'/g, "\''");
	req.body.name4 = req.body.name4.replace(/'/g, "\''");
	req.body.address = req.body.address.replace(/'/g, "\''");
	req.body.billinfo = req.body.billinfo.replace(/'/g, "\''");
	
	console.log("test1 : "+req.body.name);
	
	var query = "INSERT INTO salesforce.Account ( sfid, Name, Account_Name_2__c, Account_Name_3__c, Account_Name_4__c, AccountNumber, ";
	query += "ParentId, Address_No__c, Address__c, Kwang__c, Khet__c, Province__c, Zip__c, Country__c, ";
	query += "Billing_Information__c, Credit_Limit__c, Fax, Fax_Ext__c, Phone, Price_Book__c, Sales_District__c, Tax_Number__c, ";
	query += "Industry_Name__c, Industry_Code_Name__c, Main_Contact_Name__c, Payment_Term_Name__c, Region_Name__c, Sales_District_Name__c, ";
	query += "guid, createddate, systemmodstamp, ";
	query += "IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.name + "', '" + req.body.name2 + "', '" + req.body.name3 + "', '" + req.body.name4 + "', '";
	query += req.body.accountnumber + "', ";
	query += (req.body.parent != null ? "'" + req.body.parent + "'" : "null") + ", '"; 
	query += req.body.addressno + "', '" + req.body.address + "', '";
	query += req.body.kwang + "', '" + req.body.khet + "', '" + req.body.province + "', '" + req.body.zip + "', '";
	query += req.body.country + "', '" + req.body.billinfo + "', " + req.body.creditlimit + ", '";
	query += req.body.fax + "', '" + req.body.faxext + "', '" + req.body.phone + "', ";
	query += (req.body.pricebook != null ? "'" + req.body.pricebook + "'" : "null") + ", '";
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
		
	var haveRecord = false;
	var query = "INSERT INTO salesforce.Account ( sfid, guid, Name, Account_Name_2__c, Account_Name_3__c, Account_Name_4__c, AccountNumber, ";
	query += "ParentId, Address_No__c, Address__c, Kwang__c, Khet__c, Province__c, Zip__c, Country__c, ";
	query += "Credit_Limit__c, Fax, Fax_Ext__c, Phone, Price_Book__c, Sales_District__c, Tax_Number__c, ";
	query += "Industry_Name__c, Industry_Code_Name__c, Main_Contact_Name__c, Payment_Term_Name__c, Region_Name__c, Sales_District_Name__c, ";
	query += "createddate, systemmodstamp, ";
	query += "IsDeleted ) VALUES ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		if(req.body[i].pricebook != null)
		{
			req.body[i].name = req.body[i].name.replace(/'/g, "\''");
			req.body[i].name2 = req.body[i].name2.replace(/'/g, "\''");
			req.body[i].name3 = req.body[i].name3.replace(/'/g, "\''");
			req.body[i].name4 = req.body[i].name4.replace(/'/g, "\''");
			req.body[i].address = req.body[i].address.replace(/'/g, "\''");
			req.body[i].billinfo = req.body[i].billinfo.replace(/'/g, "\''");

			console.log("test2 : "+req.body[i].name);

			query += "('" + req.body[i].sfid + "', '" + req.body[i].sfid + "', '" + req.body[i].name + "', '" + req.body[i].name2 + "', '" + req.body[i].name3 + "', '" + req.body[i].name4 + "', '";
			query += req.body[i].accountnumber + "', ";
			query += (req.body[i].parent != null ? "'" + req.body[i].parent + "'" : "null" ) + ", '";
			query += req.body[i].addressno + "', '" + req.body[i].address + "', '";
			query += req.body[i].kwang + "', '" + req.body[i].khet + "', '" + req.body[i].province + "', '" + req.body[i].zip + "', '";
			query += req.body[i].country + "', " + req.body[i].creditlimit + ", '";
			query += req.body[i].fax + "', '" + req.body[i].faxext + "', '" + req.body[i].phone + "', ";
			query += (req.body[i].pricebook != null ? "'" + req.body[i].pricebook + "'" : "null") + ", '";
			query += req.body[i].salesdistrict + "', '" + req.body[i].taxnumber + "', '" + req.body[i].industry + "', '" + req.body[i].subindustry + "', '";
			query += req.body[i].maincontact + "', '" + req.body[i].paymentterm + "', '" + req.body[i].region + "', '" + req.body[i].salesdistrictname + "', ";
			query += "CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false), ";
			haveRecord = true;
		}
	}
	if(haveRecord == true)
	{
		query = query.substr(0, query.length - 2);
		console.log(query);

		db.select(query)
		.then(function(results) {
			console.log(results);
			res.send('{ \"status\": "success" }');
		})
		.catch(next);
	}
	else { res.send('{ \"status\": "no data" }'); }
};

exports.updateAccount = function(req, res, next) {
	var id = req.params.id;
	//console.log(id);
	if (!req.body) return res.sendStatus(400);
	if (req.body.pricebook == null) return res.send('{ \"status\": "fail", \"message\": "No Pricebook" }');
	
	req.body.name = req.body.name.replace(/'/g, "\''");
	req.body.name2 = req.body.name2.replace(/'/g, "\''");
	req.body.name3 = req.body.name3.replace(/'/g, "\''");
	req.body.name4 = req.body.name4.replace(/'/g, "\''");
	req.body.address = req.body.address.replace(/'/g, "\''");
	req.body.billinfo = req.body.billinfo.replace(/'/g, "\''");
		
	var query = "UPDATE salesforce.Account SET ";
	query += "Name = '" + req.body.name + "', ";
	query += "Account_Name_2__c = '" + req.body.name2 + "', ";
	query += "Account_Name_3__c = '" + req.body.name3 + "', ";
	query += "Account_Name_4__c = '" + req.body.name4 + "', ";
	query += "AccountNumber = '" + req.body.accountnumber + "', ";
	query += "parentid = " + (req.body.parent != null ? "'" + req.body.parent + "'" : "null") + ", ";
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
	if(req.body.pricebook != null) query += "Price_Book__c = '" + req.body.pricebook + "', ";
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
		
	var haveRecord = false;
	var query = "UPDATE salesforce.Account as o SET ";
	query += "Name = d.Name, Account_Name_2__c = d.Account_Name_2__c, Account_Name_3__c = d.Account_Name_3__c, ";
	query += "Account_Name_4__c = d.Account_Name_4__c, AccountNumber = d.AccountNumber, ";
	query += "ParentId = d.ParentId, Address_No__c = d.Address_No__c, Address__c = d.Address__c, Kwang__c = d.Kwang__c, ";
	query += "Khet__c = d.Khet__c, ";
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
		if(req.body[i].pricebook != null)
		{
			req.body[i].name = req.body[i].name.replace(/'/g, "\''");
			req.body[i].name2 = req.body[i].name2.replace(/'/g, "\''");
			req.body[i].name3 = req.body[i].name3.replace(/'/g, "\''");
			req.body[i].name4 = req.body[i].name4.replace(/'/g, "\''");
			req.body[i].address = req.body[i].address.replace(/'/g, "\''");
			req.body[i].billinfo = req.body[i].billinfo.replace(/'/g, "\''");

			query += "('" + req.body[i].sfid + "', '" + req.body[i].name + "', '" + req.body[i].name2 + "', '" + req.body[i].name3 + "', '" + req.body[i].name4 + "', '";
			query += req.body[i].accountnumber + "', ";
			query += (req.body[i].parent != null ? "'" + req.body[i].parent + "'" : "null" ) + ", '";
			query += req.body[i].addressno + "', '" + req.body[i].address + "', '";
			query += req.body[i].kwang + "', '" + req.body[i].khet + "', '" + req.body[i].province + "', '" + req.body[i].zip + "', '";
			query += req.body[i].country + "', " + req.body[i].creditlimit + ", '";
			query += req.body[i].fax + "', '" + req.body[i].faxext + "', '" + req.body[i].phone + "', ";
			query += (req.body[i].pricebook != null ? "'" + req.body[i].pricebook + "'" : "null") + ", '";
			query += req.body[i].salesdistrict + "', '" + req.body[i].taxnumber + "', '" + req.body[i].industry + "', '" + req.body[i].subindustry + "', '";
			query += req.body[i].maincontact + "', '" + req.body[i].paymentterm + "', '" + req.body[i].region + "', '" + req.body[i].salesdistrictname + "' ";
			query += "), ";
			haveRecord = true;
		}
	}
	if(haveRecord == true)
	{
		query = query.substr(0, query.length - 2);
		query += ") as d(sfid, Name, Account_Name_2__c, Account_Name_3__c, Account_Name_4__c, AccountNumber, ParentId, ";
		query += "Address_No__c, Address__c, Kwang__c, Khet__c, Province__c, Zip__c, Country__c, Credit_Limit__c, Fax, ";
		query += "Fax_Ext__c, Phone, Price_Book__c, Sales_District__c, Tax_Number__c, Industry_Code_Name__c, Industry_Name__c, ";
		query += "Main_Contact_Name__c, Payment_Term_Name__c, Region_Name__c, Sales_District_Name__c ";
		query += ") WHERE o.sfid = d.sfid";
		console.log(query);

		db.select(query)
		.then(function(results) {
			console.log(results);
			res.send('{ \"status\": "success" }');
		})
		.catch(next);
	}
	else { res.send('{ \"status\": "no data" }'); }
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
