var db = require('../server/pghelper');
var sf = require('../server/salesforce');

db.init()
.then(function(conn) {
	var query = "SELECT * FROM salesforce.call_card__c WHERE sync_status = 'Mobile'";
	db.query(query, conn)
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
						if(results[i].call_visit__c != null) body2 += '"Call_Visit__c":"' + results[i].call_visit__c + '", ';
						if(results[i].product__c != null) body2 += '"Product__c":"' + results[i].product__c + '", ';
						if(results[i].quantity_piece__c != null) body2 += '"Quantity_Piece__c":"' + results[i].quantity_piece__c + '", ';
						if(results[i].remark__c != null) body2 += '"Remark__c":"' + results[i].remark__c + '", ';
						body2 += '"Source__c":"App"}, ';
						countupdate++;
					}
					else
					{
						body += '{"attributes" : {"type" : "call_card__c"}, ';
						if(results[i].call_visit__c != null) body += '"Call_Visit__c":"' + results[i].call_visit__c + '", ';
						if(results[i].product__c != null) body += '"Product__c":"' + results[i].product__c + '", ';
						if(results[i].quantity_piece__c != null) body += '"Quantity_Piece__c":"' + results[i].quantity_piece__c + '", ';
						if(results[i].remark__c != null) body += '"Remark__c":"' + results[i].remark__c + '", ';
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
									query2 += "false, '" + JSON.stringify(results3[i].errors[0].statusCode) + "', '";
									query2 += JSON.stringify(results3[i].errors) + "'), ";
								}
							}
							query2 = query2.substr(0, query2.length - 2);
							query2 += ') as d(guid, sfid, sync_status, success, errorcode, errormessage) where d.guid = o.guid';
							db.query(query2, conn)
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
									query3 += "false, '" + JSON.stringify(results5[i].errors[0].statusCode) + "', '";
									query3 += JSON.stringify(results5[i].errors) + "'), ";
								}
							}
							query3 = query3.substr(0, query3.length - 2);
							query3 += ') as d(sfid, sync_status, success, errorcode, errormessage) where d.sfid = o.sfid';
							db.query(query3, conn)
							.then(function(results6) {

							}, function(err) { console.log(err); })
						}
					}, function(err) { console.log(err); })
				}

			}, function(err) { console.log(err); })
		}
	}, function(err) { console.log(err); })
}, function(err) { console.log(err); })
