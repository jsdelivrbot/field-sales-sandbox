var db = require('./pghelper');

exports.getList = function(req, res, next) {
	var head = req.headers['authorization'];
	var limit = req.headers['limit'];
	var start = req.headers['start'];
  
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
				var query = "SELECT * FROM salesforce.order WHERE LOWER(salesman__c) = '" + sales + "' ) Order by delivery_date__c asc";
				if(!isNaN(limit) && limit > 0)
				{
					query += " limit " + limit;
				}
				if(!isNaN(start) && start > 0)
				{
					query += " OFFSET  " + start;
				}
				console.log(query);
				db.select(query)
				.then(function(results) {
					var orderList = "(";
					for(var i = 0 ; i < results.length ; i++)
					{
						orderList += "'" + results[i].sfid + "', ";
					}
					orderList = orderList.substr(0, orderList.length - 2);
					orderList += ")";
					
					var query2 = "SELECT * FROM salesforce.orderitem WHERE orderId IN " + orderList;
					console.log(query2);
					db.select(query2)
					.then(function(results2) {
						var query3 = "SELECT * FROM salesforce.invoice__c WHERE order__c IN " + orderList;
						console.log(query3);
						db.select(query3)
						.then(function(results3) {
							var output = '[';
							for(var i = 0 ; i < results.length ; i++)
							{
								output += '{"sfid":"' + results[i].sfid;
								output += '", "AccountId":"' + results[i].accountid;
								output += '", "CallVisit":"' + results[i].call_visit__c;
								output += '", "DeliveryDate":"' + results[i].delivery_date__c;
								output += '", "EndDate":"' + results[i].enddate;
								output += '", "TotalAmount":"' + results[i].totalamount;
								output += '", "Status":"' + results[i].status;
								output += '", "Note":"' + results[i].note__c;
								var lineitem = '[';
								for(var j = 0 ; j < results2.length ; j++)
								{
									lineitem += '{"sfid":"' + results2[j].sfid;
									lineitem += '", "Product2Id":"' + results2[j].product2id;
									lineitem += '", "OrderId":"' + results2[j].orderid;
									lineitem += '", "Quantity":"' + results2[j].quantity;
									lineitem += '", "UnitPrice":"' + results2[j].unitprice;
									lineitem += '", "Discount":"' + results2[j].discount__c;
									lineitem += '", "LTP":"' + results2[j].LTP;
									lineitem += '", "FreeGift":"' + results2[j].free_gift__c;
									lineitem += '", "SizeinGrams":"' + results2[j].size_in_grams__c;
									lineitem += '", "IsDeleted":' + results2[j].isdeleted;
									lineitem += ', "systemmodstamp":"' + results2[j].systemmodstamp + '"},';

								}
								if(lineitem.length > 1)
								{
									lineitem = lineitem.substr(0, lineitem.length - 1);
								}
								lineitem += ']';
								output += '", "lineitem":' + lineitem;
								var incoices = '[';
								for(var j = 0 ; j < results3.length ; j++)
								{
									incoices += '{"sfid":"' + results3[j].sfid;
									incoices += '", "Order":"' + results3[j].order__c;
									incoices += '", "BillTo":"' + results3[j].bill_to__c;
									lineitem += '", "Name":"' + results3[j].name;
									lineitem += '", "ShipTo":"' + results3[j].ship_to__c;
									lineitem += '", "BillingType":"' + results3[j].billing_type__c;
									lineitem += '", "BillingDate":"' + results3[j].billing_date__c;
									lineitem += '", "PO No":"' + results3[j].customer_po_no__c;
									lineitem += '", "DeliveryOrder":"' + results3[j].delivery_order__c;
									lineitem += '", "IncoTerm":"' + results3[j].inco_term__c;
									lineitem += '", "PaymentTerm":"' + results3[j].payment_term__c;
									lineitem += '", "SalesMan":"' + results3[j].sales_man__c;
									lineitem += '", "SalesOrder_":"' + results3[j].sales_order__c;
									lineitem += '", "VAT":"' + results3[j].vat__c;
									lineitem += '", "SubTotal":"' + results3[j].sub_total__c;
									lineitem += '", "IsDeleted":' + results3[j].isdeleted;
									lineitem += ', "systemmodstamp":"' + results3[j].systemmodstamp + '"},';

								}
								if(incoices.length > 1)
								{
									incoices = incoices.substr(0, incoices.length - 1);
								}
								incoices += ']';
								output += '", "invoice":' + incoices;
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
