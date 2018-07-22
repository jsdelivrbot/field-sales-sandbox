var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.sync = function(req, res, next) {
	var head = req.headers['authorization'];
	var lastsync = req.query.syncdate;
	
	auth.authen(head)
	.then(function(obj) {
		var sales = obj.nickname;
		var query = "SELECT * FROM salesforce.Account WHERE sfid IN ";
		query += "(SELECT account__c FROM salesforce.account_team__c WHERE LOWER(salesman__c) = '" + sales + "')";
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
								
				var query2 = "SELECT guid as id, name, Bill_To__c as billto, Ship_To__c as shipto, ";
				query2 += "Billing_Type__c as type, Billing_Date__c as date, Customer_PO_No__c as po, ";
				query2 += "Delivery_Order__c as do, Inco_Term__c as incoterm, Payment_Term__c as paymentterm, ";
				query2 += "Sales_Man__c as salesman, Sales_Order__c as so, VAT__c as vat, Order__c as order, ";
				query2 += "Sub_Total__c as total, ";
				//query2 += "success as Success, errorcode as ErrorCode, errormessage as ErrorMessage, ";
				query2 += "to_char( systemmodstamp + interval '7 hour', 'YYYY-MM-DDTHH24:MI:SS') as updatedate , isdeleted "
				query2 += "from salesforce.invoice__c where (Bill_To__c IN " + accountList + " and ";
				query2 += "systemmodstamp + interval '7 hour' > '" + lastsync + "') ";
				db.select(query2)
				.then(function(results2) {
					/*
					var output = '{ "success": true, "errorcode" : "", "errormessage" : "", "data":[';
					for(var i = 0 ; i < results2.length ; i++)
					{
						output += '{"id":"' + results2[i].id;
						output += '", "name":"' + results2[i].name;
						output += '", "billto":"' + results2[i].billto;
						output += '", "shipto":' + (results2[i].shipto != null ? '"' + results2[i].shipto + '"' : 'null');
						output += ', "date":"' + results2[i].date;
						output += '", "total":"' + results2[i].total;
						output += '", "isdeleted":' + results2[i].isdeleted;
						output += ', "updateddate":"' + results2[i].updatedate.replace(" ", "T") + '"},';
					}
					if(results2.length)
					{
						output = output.substr(0, output.length - 1);
					}
					output += ']}';
					console.log(output);
					res.json(JSON.parse(output));
					*/
					var output = { "success": true, "errorcode" : "", "errormessage" : "", "data":[]};
					for(var i = 0 ; i < results2.length ; i++)
					{
						output.data.push({"id": results2[i].id, "name": results2[i].name, "billto": results2[i].billto,
								  "shipto": results2[i].shipto, "date": results2[i].date, "total": results2[i].total,
								  "isdeleted": results2[i].isdeleted, 
								  "updateddate": results2[i].updatedate.replace(" ", "T") + "+07:00"});
					}
					res.json(output);
				}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }'); })
			} else { res.status(887).send('{ "success": false, "errorcode" :"02", "errormessage":"No Account" }'); }
		}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }'); })
	}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"00", "errormessage":"Authen Fail." }'); })
};
