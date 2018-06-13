var db = require('./pghelper');

exports.createInvoice = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);

};

exports.updateInvoice = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);
  
};

exports.deleteInvoice = function(req, res, next) {
	var id = req.params.id;
	//var query = "DELETE FROM salesforce.invoice__c WHERE sfid = '" + id + "'";	
	var query = "UPDATE salesforce.invoice__c SET IsDeleted = true WHERE sfid ='" + id + "'"; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
