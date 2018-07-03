var db = require('./pghelper');
var sf = require('./salesforce');

var query = "SELECT * FROM salesforce.Contact WHERE sync_status = 'Mobile'";
db.select(query)
.then(function(results) {
	if(results.length > 0)
	{
		sf.authen()
		.then(function(results2) {	
			//Build results
			var lstGUID = [];
			var body = body2 = '{ "allOrNone" : false, "records" : [';
			for(var i = 0 ; i < results.length ; i++)
			{
				if(results[i].sfid != null)
				{
					body2 += '{"attributes" : {"type" : "Contact"}, "id":"' + results[i].sfid + '", ';
					if(results[i].Firstname != null) body2 += '"Firstname":"' + results[i].Firstname + '", ';
					if(results[i].Lastname != null) body2 += '"Lastname":"' + results[i].Lastname + '", ';
					if(results[i].Account != null) body2 += '"AccountId":"' + results[i].Account + '", ';
					if(results[i].Nickanme != null) body2 += '"Nickanme__c":"' + results[i].Nickanme + '", ';
					if(results[i].Phone != null) body2 += '"Phone":"' + results[i].Phone + '", ';
					if(results[i].Position != null) body2 += '"Title":"' + results[i].Position + '", ';
					if(results[i].Email != null) body2 += '"Email":"' + results[i].Email + '", ';
					if(results[i].Department != null) body2 += '"Department":"' + results[i].Department + '", ';
					if(results[i].Mobile != null) body2 += '"Mobilephone":"' + results[i].Mobile + '"}, ';
					lstGUID.push(results[i].GUID);
				}
				else
				{
					body += '{"attributes" : {"type" : "Contact"}, ';
					if(results[i].Firstname != null) body += '"Firstname":"' + results[i].Firstname + '", ';
					if(results[i].Lastname != null) body += '"Lastname":"' + results[i].Lastname + '", ';
					if(results[i].Account != null) body += '"AccountId":"' + results[i].Account + '", ';
					if(results[i].Nickanme != null) body += '"Nickanme__c":"' + results[i].Nickanme + '", ';
					if(results[i].Phone != null) body += '"Phone":"' + results[i].Phone + '", ';
					if(results[i].Position != null) body += '"Title":"' + results[i].Position + '", ';
					if(results[i].Email != null) body += '"Email":"' + results[i].Email + '", ';
					if(results[i].Department != null) body += '"Department":"' + results[i].Department + '", ';
					if(results[i].Mobile != null) body += '"Mobilephone":"' + results[i].Mobile + '"}, ';
				}
			}
			body = body.substr(0, body.length - 2);
			body += ']}';
			sf.createComposite(body, results2.token_type + ' ' + results2.access_token)
			.then(function(results3) {
				var query2 = 'UPDATE salesforce.Contact SET ';
				query2 += 'sfid = d.sfid, sync_status = d.sync_status ';
				query2 += 'from (values ';
				for(var i = 0 ; i < results3.length ; i++)
				{
					if(results3[i].success == true)	
						query2 += '("' + lstGUID[i] + '", "' + results3[i].id + '", "Sync"), ';
				}
				query2 = query2.substr(0, query2.length - 2);
				query2 += ') as d(guid, sfid, sync_status) where d.guid = guid';
				db.select(query2)
				.then(function(results4) {
					
				})
				.catch(next);
			})
			.catch(next);
			
			sf.updateComposite(body2, results2.token_type + ' ' + results2.access_token)
			.then(function(results5) {
				var query3 = 'UPDATE salesforce.Contact SET ';
				query3 += 'sync_status = d.sync_status ';
				query3 += 'from (values ';
				for(var i = 0 ; i < results5.length ; i++)
				{
					if(results5[i].success == true)	query3 += '("' + results5[i].id + '", "Sync"), ';
				}
				query3 = query3.substr(0, query3.length - 2);
				query3 += ') as d(sfid, sync_status) where d.sfid = sfid';
				db.select(query3)
				.then(function(results6) {
					
				})
				.catch(next);
			})
			.catch(next);
		})
		.catch(next);
	}
})
.catch(next);
