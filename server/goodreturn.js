var db = require('./pghelper');

exports.createReturnList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	
	var query = "INSERT INTO salesforce.good_return__c ( sfid, guid, Name, call_visit__c, product__c, quantity_case__c, ";
	query += "quantity_piece__c, invoice__c, reason__c, ";
	query += "createddate, systemmodstamp, IsDeleted ) VALUES ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].sfid + "', '" + req.body[i].name + "', '";
		query += req.body[i].visit + "', " + req.body[i].product + ", " + req.body[i].quantitycase + ", ";
		query += req.body[i].quantitypiece + ", " + req.body[i].invoice + ", " + req.body[i].reason + ", ";
		query += "CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false), ";
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
