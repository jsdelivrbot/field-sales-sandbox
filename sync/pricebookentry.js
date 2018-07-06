var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.sync = function(req, res, next) {
  var head = req.headers['authorization'];
  var lastsync = req.query.syncdate;
  
  auth.authen(head)
	.then(function(obj) {
		var sales = obj.nickname;
		var query = "SELECT * FROM salesforce.pricebook_entry__c WHERE systemmodstamp > '" + lastsync + "' ";
		db.select(query) 
		.then(function(results) {
			var output = '[';
			for(var i = 0 ; i < results.length ; i++)
			{
				output += '{"InternalId":"' + results[i].guid;
				output += '", "Product":"' + results[i].product__c;
				output += '", "Pricebook":"' + results[i].price_book__c;
				output += '", "IsDeleted":' + results[i].isdeleted;
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
