var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.sync = function(req, res, next) {
  var head = req.headers['authorization'];
  var lastsync = req.query.syncdate;
  
  auth.authen(head)
	.then(function(obj) {
		var sales = obj.nickname;
		var query = "SELECT *, to_char( systemmodstamp, 'YYYY-MM-DD HH:MI:SS') as updatedate FROM salesforce.scale_price__c WHERE systemmodstamp > '" + lastsync + "' ";
		db.select(query) 
		.then(function(results) {
			var output = '[';
			for(var i = 0 ; i < results.length ; i++)
			{
				output += '{"guid":"' + results[i].guid;
				output += '", "Pricebookentry":"' + results[i].pricebook_entry__c;
				output += '", "ListPrice":' + results[i].list_price__c;
				output += ', "NormalDiscount":' + results[i].normal_discount__C;
				output += ', "LTP":' + results[i].ltp__C;
				output += ', "Quantity":' + results[i].quantity__c;
				output += ', "Discount":' + results[i].discount__c;
				output += ', "NetPrice":' + results[i].net_price__c;
				output += ', "FOC":' + results[i].foc__c;
				output += ', "IsDeleted":' + results[i].isdeleted;
				output += ', "UpdatedDate":"' + results[i].updatedate + '"},';
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
