var db = require('./pghelper');

exports.createGroupList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	
	var query = "INSERT INTO salesforce.product_group__c ( sfid, name, column_name__c, parent__c, division__c, ";
	query += "createddate, systemmodstamp, IsDeleted ) VALUES ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].name + "', '" + req.body[i].column + "', '";
		query += req.body[i].parent + "', '" + req.body[i].division + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false), ";
	}
	if(req.body.length > 0 )
	{
		query = query.substr(0, query.length - 2);
		console.log(query);

		db.select(query)
		.then(function(results) {
			res.send('{ \"status\": "success" }');
		})
		.catch(next);
	}
	else { res.send('{ \"status\": "no data" }'); }
};

exports.updateGroupList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
  
	var query = "UPDATE salesforce.product_group__c as o SET ";
	query += "name = d.name, column_name__c = d.column_name__c, parent__c = d.parent__c, dividion__c = d.dividion__c, ";
	query += "systemmodstamp = CURRENT_TIMESTAMP from (values ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].name + "', '" + req.body[i].column + "', '";
		query += req.body[i].parent + "', '" + req.body[i].division +  "' ";
		query += "), ";
	}
	if(req.body.length > 0)
	{
		query = query.substr(0, query.length - 2);
		query += ") as d(sfid, name, column_name__c, parent__c, division__c ) WHERE o.sfid = d.sfid";
		console.log(query);

		db.select(query)
		.then(function(results) {
			res.send('{ \"status\": "success" }');
		})
		.catch(next);
	}
	else { res.send('{ \"status\": "no data" }'); }
};

exports.deleteGroupList = function(req, res, next) {
	var groupList = "(";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		groupList += "'" + req.body[i].sfid + "', ";
	}
	groupList = groupList.substr(0, groupList.length - 2);
	groupList += ")";
  	//var query = "DELETE FROM salesforce.product_group__c WHERE sfid IN " + scaleLgroupListist;	
	var query = "UPDATE salesforce.product_group__c SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid IN " + groupList; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
