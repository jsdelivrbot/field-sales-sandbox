var db = require('./pghelper');

exports.getProductGroup = function(req, res, next) {
  var query = "INSERT INTO salesforce.product2 ( sfid, guid, Name, Pricebook_Entry__c, list_price__c, normal_discount__c, ";
	query += "LTP__c, Quantity__c, Discount__c, Net_Price__c, FOC__c, ";
	query += "createddate, systemmodstamp, IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.sfid + "', '" + req.body.name + "', '" + req.body.pricebookentry + "', ";
	query += req.body.listprice + ", " + req.body.normaldiscount + ", " + req.body.ltp + ", " + req.body.quantity + ", ";
	query += req.body.discount + ", " + req.body.netprice + ", " + req.body.foc + ", "; 
	query += "CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
}
