var db = require('../server/pghelper');

function mapOrder()
{
	var query = "SELECT o1.sfid as id, o2.sfid as original, v.sfid as visit ";
	query += "FROM salesforce.Order as o1 inner join salesforce.Order as o2 on o1.originalorder_guid = o2.guid ";
	query += "inner join salesforce.call_visit__c as v on v.guid = o1.visit_guid ";
	query += "WHERE (o1.originalorder_guid IS NOT NULL and o1.originalorderid IS NULL) or ";
	query += "(o1.visit_guid IS NOT NULL and o1.call_visit__c IS NULL)";
	db.select(query)
	.then(function(results) {
		if(results.length > 0)
		{
			var query2 = 'UPDATE salesforce.Order as o SET ';
			query2 += 'originalorderid = d.originalorderid, call_visit__c = d.call_visit__c ';
			query2 += 'from (values ';
			for(var i = 0 ; i < results.length ; i++)
			{
				query2 += "('" + results[i].id + "', '" + results[i].original + "', '" + results[i].visit + "'), ";
			}
			query2 = query2.substr(0, query2.length - 2);
			query2 += ') as d(id, originalorderid, call_visit__c) where d.id = o.sfid';
			db.select(query2)
			.then(function(results2) {
				mapOrderProduct();
			}, function(err) { console.log(err); })
		}
	}, function(err) { console.log(err); })
}

function mapOrderProduct()
{
	query = "SELECT op.guid as id, o.sfid as order ";
	query += "FROM salesforce.Order_Product__c as op inner join salesforce.Order as o on op.order_guid = o.guid ";
	query += "WHERE op.order_guid IS NOT NULL and op.order__c IS NULL ";
	db.select(query)
	.then(function(results) {
		if(results.length > 0)
		{
			var query2 = 'UPDATE salesforce.Order_Product__c as o SET ';
			query2 += 'order__c = d.order__c ';
			query2 += 'from (values ';
			for(var i = 0 ; i < results.length ; i++)
			{
				query2 += "('" + results[i].id + "', '" + results[i].order + "'), ";
			}
			query2 = query2.substr(0, query2.length - 2);
			query2 += ') as d(id, order__c) where d.id = o.guid';
			db.select(query2)
			.then(function(results2) {

			}, function(err) { console.log(err); })
		}
	}, function(err) { console.log(err); })
}

mapOrder();
mapOrderProduct();
