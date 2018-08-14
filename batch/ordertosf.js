var db = require('../server/pghelper');
var sf = require('../server/salesforce');

var query = "SELECT * FROM salesforce.order WHERE sync_status = 'Mobile'";
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
				if((results[i].originalorder_guid == null || results[i].originalorder_guid == '' || results[i].originalorderid != null) &&
				   (results[i].visit_guid == null || results[i].visit_guid == '' || results[i].call_visit__c != null))
				{
					if(results[i].sfid != null)
					{
						body2 += '{"attributes" : {"type" : "Order"}, "id":"' + results[i].sfid + '", ';
						if(results[i].accountid != null) body2 += '"AccountId":"' + results[i].accountid + '", ';
						if(results[i].ship_to__c != null) body2 += '"Ship_To__c":"' + results[i].ship_to__c + '", ';
						if(results[i].originalorderid != null) body2 += '"OriginalOrderId":"' + results[i].originalorderid + '", ';
						if(results[i].call_visit__c != null) body2 += '"Call_Visit__c":"' + results[i].call_visit__c + '", ';
						if(results[i].salesman__c != null) body2 += '"Salesman__c":"' + results[i].salesman__c + '", ';
						if(results[i].delivery_date__c != null) 
						{
							//var deliverydate = results[i].delivery_date__c.toISOString().replace(/T/, ' ').replace(/\..+/, '');
							var deliverydate = results[i].delivery_date__c.toISOString().substring(0, 10);
							body2 += '"Delivery_Date__c":"' + deliverydate + '", ';
						}
						if(results[i].activateddate != null)
						{
							var activedate = results[i].activateddate.toISOString().substring(0, 10);
							body2 += '"ActivatedDate":"' + activedate + '", ';
							body2 += '"EffectiveDate":"' + activedate + '", ';
						}
						if(results[i].status != null) body2 += '"Status":"' + results[i].status + '", ';
						if(results[i].note__c != null) body2 += '"Note__c":"' + results[i].note__c + '", ';
						if(results[i].is_planned__c != null) body2 += '"Is_Planned__c":"' + results[i].is_planned__c + '", ';
						//if(results[i].isdeleted != null) body2 += '"IsDeleted":' + results[i].isdeleted + ', ';
						body2 += '"Source__c":"App"}, ';
						countupdate++;
					}
					else
					{
						body += '{"attributes" : {"type" : "Order"}, ';
						if(results[i].accountid != null) body += '"AccountId":"' + results[i].accountid + '", ';
						if(results[i].ship_to__c != null) body += '"Ship_To__c":"' + results[i].ship_to__c + '", ';
						if(results[i].originalorderid != null) body += '"OriginalOrderId":"' + results[i].originalorderid + '", ';
						if(results[i].call_visit__c != null) body += '"Call_Visit__c":"' + results[i].call_visit__c + '", ';
						if(results[i].salesman__c != null) body += '"Salesman__c":"' + results[i].salesman__c + '", ';
						if(results[i].delivery_date__c != null)
						{
							var deliverydate = results[i].delivery_date__c.toISOString().substring(0, 10);
							body += '"Delivery_Date__c":"' + deliverydate + '", ';
						}
						if(results[i].activateddate != null) 
						{
							var activedate = results[i].activateddate.toISOString().substring(0, 10);
							//body += '"ActivatedDate":"' + activedate + '", ';
							body += '"EffectiveDate":"' + activedate + '", ';
						}
						if(results[i].status != null) body += '"Status":"' + results[i].status + '", ';
						if(results[i].note__c != null) body += '"Note__c":"' + results[i].note__c + '", ';
						if(results[i].is_planned__c != null) body += '"Is_Planned__c":"' + results[i].is_planned__c + '", ';
						//if(results[i].isdeleted != null) body += '"IsDeleted":' + results[i].isdeleted + ', ';
						body += '"Source__c":"App"}, ';
						lstGUID.push(results[i].guid);
						countinsert++;
					}
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
						var query2 = 'UPDATE salesforce.order as o SET ';
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
								query2 += "('" + lstGUID[i] + "', '" + results3[i].id + "', 'Sync', ";
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
				sf.updateComposite(body2, results2.token_type + ' ' + results2.access_token)
				.then(function(results5) {
					console.log(results5);
					if(results5.length > 0)
					{
						var query3 = 'UPDATE salesforce.order as o SET ';
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
