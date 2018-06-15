var db = require('./pghelper');

exports.createInventory = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);

};

exports.updateInventory = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);
  
};

exports.deleteInventory = function(req, res, next) {
	var id = req.params.id;
  
};
