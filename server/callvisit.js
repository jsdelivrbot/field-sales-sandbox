var db = require('./pghelper');

exports.createCallVisit = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);

};

exports.updateCallVisit = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);

};

exports.deleteCallVisit = function(req, res, next) {
	var id = req.params.id;
	//var query = "DELETE FROM salesforce.call_visit__c WHERE sfid = '" + id + "'";	
	var query = "UPDATE salesforce.call_visit__c SET IsDeleted = true WHERE sfid ='" + id + "'"; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
