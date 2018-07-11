var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.sync = function(req, res, next) {
	var head = req.headers['authorization'];
	var lastsync = req.query.syncdate;
	console.log(lastsync);

	auth.authen(head)
	.then(function(obj) {
		var sales = obj.nickname;
		var query = "SELECT *, to_char( systemmodstamp + interval '7 hour' , 'YYYY-MM-DD HH24:MI:SS') as updatedate FROM salesforce.Account WHERE sfid IN ";
		query += "(SELECT account__c FROM salesforce.account_team__c WHERE LOWER(salesman__c) = '" + sales;
		query += "' ) and systemmodstamp > '" + lastsync + "' order by accountnumber asc";
		db.select(query) 
		.then(function(results) {
			var output = '{ "success": true, "errorcode" : "", "errormessage" : "", "data":[';
			for(var i = 0 ; i < results.length ; i++)
			{
				output += '{"id":"' + results[i].guid;
				output += '", "account_name":"' + results[i].name + ' ' + results[i].account_name_2__c;
				output += ' ' + results[i].account_name_3__c + ' ' + results[i].account_name_4__c;
				output += '", "account_number":"' + results[i].accountnumber;
				output += '", "parent":"' + results[i].parentid;
				output += '", "tax":"' + results[i].tax_number__c;
				output += '", "credit_limit":"' + results[i].credit_limit__c;
				output += '", "phone":"' + results[i].phone;
				output += '", "fax":"' + results[i].fax +'#' + results[i].fax_ext__c;
				output += '", "address no":"' + results[i].address_no__c;
				output += '", "address":"' + results[i].address__c;
				output += '", "kwang":"' + results[i].kwang__c;
				output += '", "khet":"' + results[i].khet__c;
				output += '", "province":"' + results[i].province__c;
				output += '", "zip":"' + results[i].zip__c;
				output += '", "country":"' + results[i].country__c;
				output += '", "pricebook":"' + results[i].price_book__c;
				output += '", "industry":"' + results[i].industry_name__c;
				output += '", "subindustry":"' + results[i].industry_code_name__c;
				output += '", "paymentterm":"' + results[i].payment_term_name__c;
				output += '", "region":"' + results[i].region_name__c;
				output += '", "salesdistrict":"' + results[i].sales_district_name__c;
				output += '", "isdeleted":' + results[i].isdeleted;
				output += ', "updateddate":"' + results[i].updatedate + '"},';
			}
			if(results.length)
			{
				output = output.substr(0, output.length - 1);
			}
			output += ']}';
			console.log(output);
			res.json(JSON.parse(output));
		}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }'); })
	}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"00", "errormessage":"Authen Fail." }'); })
};
