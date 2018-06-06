var db = require('./pghelper');

exports.getInfo = function(req, res, next) {
	res.send('Get Account Info');
};