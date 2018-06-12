var db = require('./pghelper');

exports.createPricebookentry = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);

};

exports.updatePricebookentry = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);
  
};

exports.deletePricebookentry = function(req, res, next) {
	var id = req.params.id;
	//var query = "DELETE FROM salesforce.pricebook_entry__c WHERE sfid = '" + id + "'";	
	var query = "UPDATE salesforce.pricebook_entry__c SET IsDeleted = true WHERE sfid ='" + id + "'"; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
