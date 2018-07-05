var db = require('../server/pghelper');
var sf = require('../server/salesforce');

var query = "SELECT * FROM salesforce.order_product__c WHERE sync_status = 'Mobile'";
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
				if((results[i].order_guid == null || results[i].order__c != null) &&
				   (results[i].parent_guid == null || results[i].parent_item__c != null)
				{
					if(results[i].sfid != null)
					{
						body2 += '{"attributes" : {"type" : "Order_Product__c"}, "id":"' + results[i].sfid + '", ';
						if(results[i].product__c != null) body2 += '"Product__c":"' + results[i].product__c + '", ';
						if(results[i].pricebook_entry__c != null) body2 += '"Pricebook_Entry__c":"' + results[i].pricebook_entry__c + '", ';
						if(results[i].order__c != null) body2 += '"Order__c":"' + results[i].order__c + '", ';
						if(results[i].parent_item__c != null) body2 += '"Parent_Item__c":"' + results[i].parent_item__c + '", ';
						if(results[i].quantity__c != null) body2 += '"Quantity__c":' + results[i].quantity__c + ', ';
						if(results[i].price__c != null) body2 += '"Price__c":' + results[i].price__c + ', ';
						if(results[i].free_gift__c != null) body2 += '"Free_Gift__c":' + results[i].free_gift__c + ', ';
						//if(results[i].isdeleted != null) body2 += '"IsDeleted":' + results[i].isdeleted + ', ';
						body2 = '"Source__c":"App"}';
						countupdate++;
					}
					else
					{
						body += '{"attributes" : {"type" : "Order_Product__c"}, ';
						if(results[i].product__c != null) body += '"Product__c":"' + results[i].product__c + '", ';
						if(results[i].pricebook_entry__c != null) body += '"Pricebook_Entry__c":"' + results[i].pricebook_entry__c + '", ';
						if(results[i].order__c != null) body += '"Order__c":"' + results[i].order__c + '", ';
						if(results[i].parent_item__c != null) body += '"Parent_Item__c":"' + results[i].parent_item__c + '", ';
						if(results[i].quantity__c != null) body += '"Quantity__c":' + results[i].quantity__c + ', ';
						if(results[i].price__c != null) body += '"Price__c":' + results[i].price__c + ', ';
						if(results[i].free_gift__c != null) body += '"Free_Gift__c":' + results[i].free_gift__c + ', ';
						//if(results[i].isdeleted != null) body += '"IsDeleted":' + results[i].isdeleted + ', ';
						body = '"Source__c":"App"}';
						lstGUID.push(results[i].guid);
						countinsert++;
					}
				}
			}
			body = body.substr(0, body.length - 2);
			body += ']}';
			body2 = body2.substr(0, body2.length - 2);
			body2 += ']}';
			if(countinsert > 0)
			{
				console.log(body);
				sf.createComposite(body, results2.token_type + ' ' + results2.access_token)
				.then(function(results3) {
					console.log(results3);
					if(results3.length > 0)
					{
						var query2 = 'UPDATE salesforce.order_product__c as o SET ';
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
			}
			
			if(countupdate > 0)
			{
				console.log(body2);
				sf.updateComposite(body2, results2.token_type + ' ' + results2.access_token)
				.then(function(results5) {
					console.log(results5);
					if(results5.length > 0)
					{
						var query3 = 'UPDATE salesforce.order_product__c as o SET ';
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
			}
		}, function(err) { console.log(err); })
	}
}, function(err) { console.log(err); })
