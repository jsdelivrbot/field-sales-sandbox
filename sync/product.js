var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.sync = function(req, res, next) {
  var head = req.headers['authorization'];
  var lastsync = req.query.syncdate;
  
  auth.authen(head)
	.then(function(obj) {
		var sales = obj.nickname;
		var query = "SELECT *, to_char( systemmodstamp, 'YYYY-MM-DD HH:MI:SS') as updatedate FROM salesforce.Product2 WHERE systemmodstamp > '" + lastsync + "' order by ProductCode asc";
		db.select(query) 
		.then(function(results) {
			var output = '[';
			for(var i = 0 ; i < results.length ; i++)
			{
				output += '{"id":"' + results[i].guid;
				output += '", "ProductCode":"' + results[i].productcode;
				output += '", "ProductName":"' + results[i].name;
				output += '", "ProductNameTH":"' + results[i].Product_Name_TH__c;
				output += '", "Description":"' + results[i].description;
				output += '", "Brand":"' + results[i].product_group__c;
				output += '", "Family":"' + results[i].family;
				output += '", "Type":"' + results[i].product_type__c;
				output += '", "Net_Weight":"' + results[i].net_weight_g__c;
				output += '", "Pack_Size":"' + results[i].pack_size__c;
				output += '", "IsActive":' + results[i].isactive;
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
