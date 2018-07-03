var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.sync = function(req, res, next) {
  var head = req.headers['authorization'];
  var lastsync = req.headers['lastsync'];
  
  auth.authen(head)
	.then(function(obj) {
		var sales = obj.nickname;
		var query = "SELECT * FROM salesforce.pricebook2 WHERE systemmodstamp > '" + lastsync + "' by Name asc";
		db.select(query) 
		.then(function(results) {
			var output = '[';
			for(var i = 0 ; i < results.length ; i++)
			{
				output += '{"InternalId":"' + results[i].guid;
				output += '", "Name":"' + results[i].name;
				output += '", "Description":"' + results[i].description;
				output += '", "IsActive":"' + results[i].isactive;
				output += ', "IsDeleted":' + results[i].isdeleted;
				output += ', "systemmodstamp":"' + results[i].systemmodstamp + '"},';
			}
			if(results.length)
			{
				output = output.substr(0, output.length - 1);
			}
			output += ']';
			console.log(output);
			res.json(JSON.parse(output));
		}) 
		.catch(next);
	}, function(err) { res.status(887).send("{ \"status\": \"fail\" }"); })
};
