var db = require('../server/pghelper');
var sf = require('../server/salesforce');

var query = "SELECT * FROM salesforce.call_card__c WHERE sync_status = 'Mobile'";
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
					body2 += '{"attributes" : {"type" : "call_card__c"}, "id":"' + results[i].sfid + '", ';
					if(results[i].name != null) body2 += '"Name":"' + results[i].name + '", ';
					if(results[i].account__c != null) body2 += '"Account__c":"' + results[i].account__c + '", ';
					if(results[i].start != null) body2 += '"Plan_Start__c":"' + results[i].start.replace(" ", "T") + '", ';
					if(results[i].end != null) body2 += '"Plan_End__c":"' + results[i].end.replace(" ", "T") + '", ';
					if(results[i].comment__c != null) body2 += '"Comment__c":"' + results[i].comment__c + '", ';
					if(results[i].salesman__c != null) body2 += '"Salesman__c":"' + results[i].salesman__c + '", ';
					if(results[i].status__c != null) body2 += '"Status__c":"' + results[i].status__c + '", ';
					if(results[i].check_in_time != null) body2 += '"Check_In_Time__c":"' + results[i].check_in_time.replace(" ", "T") + '", ';
					if(results[i].check_in_location__latitude__s != null) body2 += '"Check_In_Location__Latitude__s":"' + results[i].check_in_location__latitude__s + '", ';
					if(results[i].check_in_location__longitude__s != null) body2 += '"Check_In_Location__Longitude__s":"' + results[i].check_in_location__longitude__s + '", ';
					if(results[i].check_out_time != null) body2 += '"Status__c":"' + results[i].check_out_time.replace(" ", "T") + '", ';
					if(results[i].check_out_location__latitude__s != null) body2 += '"Check_Out_Location__Latitude__s":"' + results[i].check_out_location__latitude__s + '", ';
					if(results[i].check_out_location__longitude__s != null) body2 += '"Check_out_Location__Longitude__s":"' + results[i].check_out_location__longitude__s + '", ';
					if(results[i].call_type__c != null) body2 += '"Call_Type__c":"' + results[i].call_type__c + '", ';
					body2 += '"Source__c":"App"}, ';
					countupdate++;
				}
				else
				{
					body += '{"attributes" : {"type" : "call_card__c"}, ';
					if(results[i].name != null) body += '"Name":"' + results[i].name + '", ';
					if(results[i].account__c != null) body += '"Account__c":"' + results[i].account__c + '", ';
					if(results[i].start != null) body += '"Plan_Start__c":"' + results[i].start.replace(" ", "T") + '", ';
					if(results[i].end != null) body += '"Plan_End__c":"' + results[i].end.replace(" ", "T") + '", ';
					if(results[i].comment__c != null) body += '"Comment__c":"' + results[i].comment__c + '", ';
					if(results[i].salesman__c != null) body += '"Salesman__c":"' + results[i].salesman__c + '", ';
					if(results[i].status__c != null) body += '"Status__c":"' + results[i].status__c + '", ';
					if(results[i].check_in_time != null) body += '"Check_In_Time__c":"' + results[i].check_in_time.replace(" ", "T") + '", ';
					if(results[i].check_in_location__latitude__s != null) body += '"Check_In_Location__Latitude__s":"' + results[i].check_in_location__latitude__s + '", ';
					if(results[i].check_in_location__longitude__s != null) body += '"Check_In_Location__Longitude__s":"' + results[i].check_in_location__longitude__s + '", ';
					if(results[i].check_out_time != null) body += '"Status__c":"' + results[i].check_out_time.replace(" ", "T") + '", ';
					if(results[i].check_out_location__latitude__s != null) body += '"Check_Out_Location__Latitude__s":"' + results[i].check_out_location__latitude__s + '", ';
					if(results[i].check_out_location__longitude__s != null) body += '"Check_out_Location__Longitude__s":"' + results[i].check_out_location__longitude__s + '", ';
					if(results[i].call_type__c != null) body += '"Call_Type__c":"' + results[i].call_type__c + '", ';
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
						var query2 = 'UPDATE salesforce.call_card__c as o SET ';
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
								query2 += "false, '" + JSON.stringify(results3[i].errorCode) + "', '";
								query2 += JSON.stringify(results3[i].message) + "'), ";
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
				console.log(body2);
				sf.updateComposite(body2, results2.token_type + ' ' + results2.access_token)
				.then(function(results5) {
					console.log(results5);
					if(results5.length > 0)
					{
						var query3 = 'UPDATE salesforce.call_card__c as o SET ';
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
								query3 += "false, '" + JSON.stringify(results5[i].errorCode) + "', '";
								query3 += JSON.stringify(results5[i].message) + "'), ";
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
