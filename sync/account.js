var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.sync = function(req, res, next) {
	var head = req.headers['authorization'];
	var lastsync = req.query.syncdate;
	console.log(lastsync);

	auth.authen(head)
	.then(function(obj) {
		var sales = obj.nickname;
		var query = "SELECT account__c FROM salesforce.account_team__c WHERE LOWER(salesman__c) = '" + sales + "'";
		db.select(query) 
		.then(function(results) {
			var query2 = "SELECT *, to_char( systemmodstamp + interval '7 hour' , 'YYYY-MM-DD HH24:MI:SS') as updatedate FROM salesforce.Account WHERE sfid IN ";
			query2 += "(SELECT account__c FROM salesforce.account_team__c WHERE LOWER(salesman__c) = '" + sales;
			query2 += "' ) and systemmodstamp > '" + lastsync + "' order by accountnumber asc";
			db.select(query2) 
			.then(function(results2) {
				var output = '{ "success": true, "errorcode" : "", "errormessage" : "", "data":[';
				for(var i = 0 ; i < results2.length ; i++)
				{
					output += '{"id":"' + results2[i].guid;
					output += '", "account_name":"' + results2[i].name + ' ' + results2[i].account_name_2__c;
					output += ' ' + results2[i].account_name_3__c + ' ' + results2[i].account_name_4__c;
					output += '", "account_number":"' + results2[i].accountnumber;
					output += '", "parent":"' + results2[i].parentid;
					output += '", "tax":"' + results2[i].tax_number__c;
					output += '", "credit_limit":"' + results2[i].credit_limit__c;
					output += '", "phone":"' + results2[i].phone;
					output += '", "fax":"' + results2[i].fax +'#' + results2[i].fax_ext__c;
					//output += '", "address no":"' + results2[i].address_no__c;
					//output += '", "address":"' + results2[i].address__c;
					output += '", "address":"' + results2[i].address_no__c + " " + results2[i].address__c;
					output += '", "kwang":"' + results2[i].kwang__c;
					output += '", "khet":"' + results2[i].khet__c;
					output += '", "province":"' + results2[i].province__c;
					output += '", "zip":"' + results2[i].zip__c;
					output += '", "country":"' + results2[i].country__c;
					output += '", "pricebook":"' + results2[i].price_book__c;
					output += '", "industry":"' + results2[i].industry_name__c;
					output += '", "subindustry":"' + results2[i].industry_code_name__c;
					output += '", "paymentterm":"' + results2[i].payment_term_name__c;
					output += '", "region":"' + results2[i].region_name__c;
					output += '", "salesdistrict":"' + results2[i].sales_district_name__c;
					var division = '99';
					output += '", "division":"' + division;
					output += '", "isdeleted":' + results2[i].isdeleted;
					output += ', "updateddate":"' + results2[i].updatedate + '"},';
				}
				if(results.length)
				{
					output = output.substr(0, output.length - 1);
				}
				output += ']}';
				console.log(output);
				res.json(JSON.parse(output));
			}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }'); })
		}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }'); })
	}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"00", "errormessage":"Authen Fail." }'); })
};
