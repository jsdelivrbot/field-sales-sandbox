var db = require('./pghelper');

exports.createPromotion = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
  
};

exports.updatePromotion = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);
  
};

exports.deletePromotion = function(req, res, next) {
	var id = req.params.id;
  //var query = "DELETE FROM salesforce.Promotion__c WHERE sfid = '" + id + "'";	
	var query = "UPDATE salesforce.Promotion__c SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid ='" + id + "'"; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
