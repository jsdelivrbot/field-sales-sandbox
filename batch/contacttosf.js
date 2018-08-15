var db = require('../server/pghelper');
var sf = require('../server/salesforce');

var query = "SELECT * FROM salesforce.Contact WHERE sync_status = 'Mobile'";
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
					body2 += '{"attributes" : {"type" : "Contact"}, "id":"' + results[i].sfid + '", ';
					if(results[i].firstname != null) body2 += '"Firstname":"' + results[i].firstname + '", ';
					if(results[i].lastname != null) body2 += '"Lastname":"' + results[i].lastname + '", ';
					if(results[i].accountid != null) body2 += '"AccountId":"' + results[i].accountid + '", ';
					if(results[i].nickanme__c != null) body2 += '"Nickanme__c":"' + results[i].nickanme__c + '", ';
					if(results[i].phone != null) body2 += '"Phone":"' + results[i].phone + '", ';
					if(results[i].title != null) body2 += '"Title":"' + results[i].title + '", ';
					if(results[i].email != null) body2 += '"Email":"' + results[i].email + '", ';
					if(results[i].department != null) body2 += '"Department":"' + results[i].department + '", ';
					if(results[i].mobilephone != null) body2 += '"Mobilephone":"' + results[i].mobilephone + '", ';
					//if(results[i].isdeleted != null) body2 += '"IsDeleted":' + results[i].isdeleted + ', ';
					body2 += '"Source__c":"App"}, ';
					countupdate++;
				}
				else
				{
					body += '{"attributes" : {"type" : "Contact"}, ';
					if(results[i].firstname != null) body += '"Firstname":"' + results[i].firstname + '", ';
					if(results[i].lastname != null) body += '"Lastname":"' + results[i].lastname + '", ';
					if(results[i].account != null) body += '"AccountId":"' + results[i].accountid + '", ';
					if(results[i].nickanme__c != null) body += '"Nickanme__c":"' + results[i].nickanme__c + '", ';
					if(results[i].phone != null) body += '"Phone":"' + results[i].phone + '", ';
					if(results[i].title != null) body += '"Title":"' + results[i].title + '", ';
					if(results[i].email != null) body += '"Email":"' + results[i].email + '", ';
					if(results[i].department != null) body += '"Department":"' + results[i].department + '", ';
					if(results[i].mobilephone != null) body += '"Mobilephone":"' + results[i].mobilephone + '", ';
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
						var query2 = 'UPDATE salesforce.Contact as o SET ';
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
								query2 += JSON.stringify(results3[i].errors[0].message) + "'), ";
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
						var query3 = 'UPDATE salesforce.Contact as o SET ';
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
								query3 += JSON.stringify(results5[i].errors[0].message) + "'), ";
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
