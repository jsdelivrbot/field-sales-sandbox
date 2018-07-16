var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.sync = function(req, res, next) {
  var head = req.headers['authorization'];
  var lastsync = req.query.syncdate;
  
  auth.authen(head)
	.then(function(obj) {
		var sales = obj.nickname;
		var query = "SELECT *, to_char( systemmodstamp + interval '7 hour', 'YYYY-MM-DD HH24:MI:SS') as updatedate FROM salesforce.promotion__c WHERE systemmodstamp > '" + lastsync + "' ";
		db.select(query) 
		.then(function(results) {
			var output = '{ "success": true, "errorcode" : "", "errormessage" : "", "data":[';
			for(var i = 0 ; i < results.length ; i++)
			{
				output += '{"id":"' + results[i].guid;
				output += '", "name":"' + results[i].name;
				output += '", "start":"' + results[i].start_date__c;
				output += '", "end":"' + results[i].end_date__c;
				output += '", "description":"' + results[i].description__c;
				output += '", "url":"' + results[i].url__c;
				output += '", "isdeleted":' + results[i].isdeleted;
				output += ', "updateddate":"' + results[i].updatedate + '"},';
			}
			if(results.length)
			{
				output = output.substr(0, output.length - 1);
			}
			output += ']}';
			console.log(output);
			res.json(JSON.parse(output));
		}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }'); })
	}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"00", "errormessage":"Authen Fail." }'); })
};
