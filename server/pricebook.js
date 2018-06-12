var db = require('./pghelper');

exports.createPricebook = function(req, res, next) {
  if (!req.body) return res.sendStatus(400);
};

exports.updatePricebook = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);
  
};

exports.deletePricebook = function(req, res, next) {
  var id = req.params.id;
  
};
