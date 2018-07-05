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
			for(var i = 0 ; i < results.length ; i++)
			{
				if(results[i].sfid != null && 
				   (results[i].originalorder_guid == null || results[i].originalorderid != null) &&
				   (results[i].visit_guid == null || results[i].call_visit__c != null))
				{
					body2 += '{"attributes" : {"type" : "Order"}, "id":"' + results[i].sfid + '", ';
					if(results[i].accountid != null) body2 += '"AccountId":"' + results[i].accountid + '", ';
					if(results[i].ship_to__c != null) body2 += '"Ship_To__c":"' + results[i].ship_to__c + '", ';
					if(results[i].originalorderid != null) body2 += '"OriginalOrderId":"' + results[i].originalorderid + '", ';
					if(results[i].call_visit__c != null) body2 += '"Call_Visit__c":"' + results[i].call_visit__c + '", ';
					if(results[i].delivery_date__c != null) body2 += '"Delivery_Date__c":"' + results[i].delivery_date__c + '", ';
					if(results[i].activateddate != null) body2 += '"ActivatedDate":"' + results[i].activateddate + '", ';
					if(results[i].status != null) body2 += '"Status":"' + results[i].status + '", ';
					if(results[i].note__c != null) body2 += '"Note__c":"' + results[i].note__c + '", ';
					if(results[i].is_planned__c != null) body2 += '"Is_Planned__c":"' + results[i].is_planned__c + '", ';
					if(results[i].isdeleted != null) body2 += '"IsDeleted":"' + results[i].isdeleted + '", ';
				}
				else
				{
					body += '{"attributes" : {"type" : "Order"}, ';
					if(results[i].accountid != null) body += '"AccountId":"' + results[i].accountid + '", ';
					if(results[i].ship_to__c != null) body += '"Ship_To__c":"' + results[i].ship_to__c + '", ';
					if(results[i].originalorderid != null) body += '"OriginalOrderId":"' + results[i].originalorderid + '", ';
					if(results[i].call_visit__c != null) body += '"Call_Visit__c":"' + results[i].call_visit__c + '", ';
					if(results[i].delivery_date__c != null) body += '"Delivery_Date__c":"' + results[i].delivery_date__c + '", ';
					if(results[i].activateddate != null) body += '"ActivatedDate":"' + results[i].activateddate + '", ';
					if(results[i].status != null) body += '"Status":"' + results[i].status + '", ';
					if(results[i].note__c != null) body += '"Note__c":"' + results[i].note__c + '", ';
					if(results[i].is_planned__c != null) body += '"Is_Planned__c":"' + results[i].is_planned__c + '", ';
					if(results[i].isdeleted != null) body += '"IsDeleted":"' + results[i].isdeleted + '", ';
					lstGUID.push(results[i].guid);
				}
			}
			body = body.substr(0, body.length - 2);
			body += '}]}';
			body2 = body2.substr(0, body2.length - 2);
			body2 += '}]}';
			console.log(body);
			sf.createComposite(body, results2.token_type + ' ' + results2.access_token)
			.then(function(results3) {
				console.log(results3);
				if(results3.length > 0)
				{
					var query2 = 'UPDATE salesforce.order as o SET ';
					query2 += 'sfid = d.sfid, sync_status = d.sync_status ';
					query2 += 'from (values ';
					for(var i = 0 ; i < results3.length ; i++)
					{
						if(results3[i].success == true)	
							query2 += "('" + lstGUID[i] + "', '" + results3[i].id + "', 'Sync'), ";
					}
					query2 = query2.substr(0, query2.length - 2);
					query2 += ') as d(guid, sfid, sync_status) where d.guid = o.guid';
					db.select(query2)
					.then(function(results4) {
						
					}, function(err) { console.log(err); })
				}
			}, function(err) { console.log(err); })
			
			console.log(body2);
			sf.updateComposite(body2, results2.token_type + ' ' + results2.access_token)
			.then(function(results5) {
				console.log(results5);
				if(results5.length > 0)
				{
					var query3 = 'UPDATE salesforce.order as o SET ';
					query3 += 'sync_status = d.sync_status ';
					query3 += 'from (values ';
					for(var i = 0 ; i < results5.length ; i++)
					{
						if(results5[i].success == true)	query3 += "('" + results5[i].id + "', 'Sync'), ";
					}
					query3 = query3.substr(0, query3.length - 2);
					query3 += ') as d(sfid, sync_status) where d.sfid = o.sfid';
					db.select(query3)
					.then(function(results6) {

					}, function(err) { console.log(err); })
				}
			}, function(err) { console.log(err); })
		}, function(err) { console.log(err); })
	}
}, function(err) { console.log(err); })
