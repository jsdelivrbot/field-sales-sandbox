var db = require('./pghelper');

exports.createSalesPrice = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
  
};

exports.updateSalesPrice = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);
  
};

exports.deleteSalesPrice = function(req, res, next) {
	var id = req.params.id;
  //var query = "DELETE FROM salesforce.scale_price__c WHERE sfid = '" + id + "'";	
	var query = "UPDATE salesforce.scale_price__c SET IsDeleted = true WHERE sfid ='" + id + "'"; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
