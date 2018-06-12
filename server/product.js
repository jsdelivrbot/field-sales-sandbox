var db = require('./pghelper');

exports.createProduct = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);


};

exports.updateProduct = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);

};

exports.deleteProduct = function(req, res, next) {
	var id = req.params.id;
	//var query = "DELETE FROM salesforce.Product2 WHERE sfid = '" + id + "'";	
	var query = "UPDATE salesforce.Product2 SET IsDeleted = true WHERE sfid ='" + id + "'"; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};
