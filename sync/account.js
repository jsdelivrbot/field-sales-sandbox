var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.sync = function(req, res, next) {
  var head = req.headers['authorization'];
  var lastsync = req.query.syncdate;
  console.log(lastsync);
  
  auth.authen(head)
	.then(function(obj) {
		var sales = obj.nickname;
		var query = "SELECT * FROM salesforce.Account WHERE sfid IN ";
		query += "(SELECT account__c FROM salesforce.account_team__c WHERE LOWER(salesman__c) = '" + sales;
		query += "' ) and systemmodstamp > '" + lastsync + "' order by accountnumber asc";
		db.select(query) 
		.then(function(results) {
			var output = '[';
			for(var i = 0 ; i < results.length ; i++)
			{
				output += '{"InternalId":"' + results[i].guid;
				output += '", "AccountName":"' + results[i].name + ' ' + results[i].account_name_2__c;
				output += ' ' + results[i].account_name_3__c + ' ' + results[i].account_name_4__c;
				output += '", "AccountNumber":"' + results[i].accountnumber;
				output += '", "Tax":"' + results[i].tax_number__c;
				output += '", "CreditLimit":"' + results[i].credit_limit__c;
				output += '", "Phone":"' + results[i].phone;
				output += '", "Fax":"' + results[i].fax +'#' + results[i].fax_ext__c;
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
				output += '", "IsDeleted":' + results[i].isdeleted;
				output += ', "systemmodstamp":"' + results[i].systemmodstamp + '"},';
			}
			if(results.length)
			{
				output = output.substr(0, output.length - 1);
			}
			output += ']';
			console.log(output);
			res.json(JSON.parse(output));
		}) 
		.catch(next);
	}, function(err) { res.status(887).send("{ \"status\": \"fail\" }"); })
};
