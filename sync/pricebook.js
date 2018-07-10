var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.sync = function(req, res, next) {
  var head = req.headers['authorization'];
  var lastsync = req.query.syncdate;
  
  auth.authen(head)
	.then(function(obj) {
		var sales = obj.nickname;
		var query = "SELECT *, to_char( systemmodstamp + interval '7 hour' , 'YYYY-MM-DD HH24:MI:SS') as updatedate FROM salesforce.pricebook2 WHERE systemmodstamp > '" + lastsync + "' order by Name asc";
		db.select(query) 
		.then(function(results) {
			var output = '{ "success": true, "errorcode" : "", "errormessage" : "", "data":[';
			for(var i = 0 ; i < results.length ; i++)
			{
				output += '{"id":"' + results[i].guid;
				output += '", "name":"' + results[i].name;
				output += '", "description":"' + results[i].description;
				output += '", "isactive":' + results[i].isactive;
				output += ', "isdeleted":' + results[i].isdeleted;
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
