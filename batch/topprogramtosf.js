var db = require('../server/pghelper');
var sf = require('../server/salesforce');

var query = "SELECT * FROM salesforce.Top_Store_Program__c WHERE sync_status = 'Mobile'";
db.select(query)
.then(function(results) {
	console.log(results);
	if(results.length > 0)
	{
		sf.authen()
		.then(function(results2) {	
			//Build results
			var lstGUID = [];
			var body = '{ "allOrNone" : false, "records" : [';
			var body2 = '{ "allOrNone" : false, "records" : [';
			var countinsert = 0;
			var countupdate = 0;
			for(var i = 0 ; i < results.length ; i++)
			{
				if(results[i].sfid != null)
				{
					body2 += '{"attributes" : {"type" : "Top_Store_Program__c"}, "id":"' + results[i].sfid + '", ';
					if(results[i].name != null) body2 += '"Name":"' + results[i].name + '", ';
					if(results[i].account__c != null) body2 += '"Account__c":"' + results[i].account__c + '", ';
					if(results[i].date__c != null)
					{
						var date = results[i].date__c.toISOString().substring(0, 10);
						body2 += '"Date__c":"' + date + '", ';
					}
					if(results[i].event_type__c != null) body2 += '"Event_Type__c":"' + results[i].event_type__c + '", ';
					//if(results[i].isdeleted != null) body2 += '"IsDeleted":' + results[i].isdeleted + ', ';
					body2 += '"Source__c":"App"}, ';
					countupdate++;
				}
				else
				{
					body += '{"attributes" : {"type" : "Top_Store_Program__c"}, ';
					if(results[i].name != null) body += '"Name":"' + results[i].name + '", ';
					if(results[i].account__c != null) body += '"Account__c":"' + results[i].account__c + '", ';
					if(results[i].date__c != null)
					{
						var date = results[i].date__c.toISOString().substring(0, 10);
						body += '"Date__c":"' + date + '", ';
					}
					if(results[i].event_type__c != null) body += '"Event_Type__c":"' + results[i].event_type__c + '", ';
					//if(results[i].isdeleted != null) body += '"IsDeleted":' + results[i].isdeleted + ', ';
					body += '"Source__c":"App"}, ';
					lstGUID.push(results[i].guid);
					countinsert++;
				}
			}
			body = body.substr(0, body.length - 2);
			body += ']}';
			body2 = body2.substr(0, body2.length - 2);
			body2 += ']}';
			console.log("==============================Body Insert======================");
			console.log(body);
			console.log("==============================Body Update======================");
			console.log(body2);
			if(countinsert > 0)
			{
				sf.createComposite(body, results2.token_type + ' ' + results2.access_token)
				.then(function(results3) {
					console.log(results3);
					if(results3.length > 0)
					{
						var query2 = 'UPDATE salesforce.Top_Store_Program__c as o SET ';
						query2 += 'sfid = d.sfid, sync_status = d.sync_status, success = d.success, ';
						query2 += 'errorcode = d.errorcode, errormessage = d.errormessage ';
						query2 += 'from (values ';
						for(var i = 0 ; i < results3.length ; i++)
						{
							if(results3[i].success == true)	
							{
								query2 += "('" + lstGUID[i] + "', '" + results3[i].id + "', 'Sync', ";
								query2 += "true, '00', ''), ";
							}
							else
							{
								query2 += "('" + lstGUID[i] + "', null, 'Sync', ";
								query2 += "false, '" + JSON.stringify(results3[i].errors[0].statusCode) + "', '";
								query2 += JSON.stringify(results3[i].errors) + "'), ";
							}
						}
						query2 = query2.substr(0, query2.length - 2);
						query2 += ') as d(guid, sfid, sync_status, success, errorcode, errormessage) where d.guid = o.guid';
						db.select(query2)
						.then(function(results4) {

						}, function(err) { console.log(err); })
					}
				}, function(err) { console.log(err); })
			}
			
			if(countupdate > 0)
			{
				sf.updateComposite(body2, results2.token_type + ' ' + results2.access_token)
				.then(function(results5) {
					console.log(results5);
					if(results5.length > 0)
					{
						var query3 = 'UPDATE salesforce.Top_Store_Program__c as o SET ';
						query3 += 'sync_status = d.sync_status, success = d.success, ';
						query3 += 'errorcode = d.errorcode, errormessage = d.errormessage ';
						query3 += 'from (values ';
						for(var i = 0 ; i < results5.length ; i++)
						{
							if(results5[i].success == true)	
							{
								query3 += "('" + results5[i].id + "', 'Sync', ";
								query3 += "true, '00', ''), ";
							}
							else
							{
								query3 += "('" + results5[i].id + "', 'Sync', ";
								query3 += "false, '" + JSON.stringify(results5[i].errors[0].statusCode) + "', '";
								query3 += JSON.stringify(results5[i].errors) + "'), ";
							}
						}
						query3 = query3.substr(0, query3.length - 2);
						query3 += ') as d(sfid, sync_status, success, errorcode, errormessage) where d.sfid = o.sfid';
						db.select(query3)
						.then(function(results6) {

						}, function(err) { console.log(err); })
					}
				}, function(err) { console.log(err); })
			}
		}, function(err) { console.log(err); })
	}
}, function(err) { console.log(err); })
