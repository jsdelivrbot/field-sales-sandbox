var db = require('./pghelper');

exports.getList = function(req, res, next) {
	res.send('Get Account List');
};

exports.getInfo = function(req, res, next) {
	var id = req.params.id;
	res.send('Get Account Info');
};

exports.createAccount = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	
	var query = "INSERT INTO salesforce.Account ( sfid, Name, Account_Name_2__c, Account_Name_3__c, Account_Name_4__c, Salesman__c, AccountNumber, ";
	query += "Address_No__c, BillingCity, BillingCountry, BillingLatitude, BillingLongitude, BillingPostalCode, BillingState, BillingStreet, ";
	query += "Billing_Information__c, Credit_Limit__c, Fax, Fax_Ext__c, Phone, Price_Book__c, Sales_District__c, Tax_Number__c, ";
	query += "IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.name + "', '" + req.body.name2 + "', '" + req.body.name3 + "', '" + req.body.name4 + "', '";
	query += req.body.salesman + "', '" + req.body.accountnumber + "', '" + req.body.addressno + "', '" + req.body.city + "', '";
	query += req.body.country + "', '" + req.body.latitude + "', '" + req.body.longitude + "', '" + req.body.postalcode + "', '";
	query += req.body.stage + "', '" + req.body.street + "', '" + req.body.billinfo + "', '" + req.body.creditlimit + "', '";
	query += req.body.fax + "', '" + req.body.faxext + "', '" + req.body.phone + "', '" + req.body.pricebook + "', '";
	query += req.body.salesdistrict + "', '" + req.body.taxnumber + "', '" + req.body.isdeleted +"')";
	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.updateAccount = function(req, res, next) {
	var id = req.params.id;
	console.debug(id);
	if (!req.body) return res.sendStatus(400);
	console.debug(req.body);
	res.send('Update Account');
}
