var db = require('../server/pghelper');
var auth = require('../server/auth0');

exports.sync = function(req, res, next) {
  var head = req.headers['authorization'];
  var lastsync = req.query.syncdate;
  
  auth.authen(head)
	.then(function(obj) {
		var sales = obj.nickname;
		var query = "SELECT *, to_char( systemmodstamp + interval '7 hour', 'YYYY-MM-DD HH24:MI:SS') as updatedate ";
	        query += "FROM salesforce.Product2 WHERE systemmodstamp + interval '7 hour' > '" + lastsync + "' order by ProductCode asc";
		db.select(query) 
		.then(function(results) {
			/*
			var output = '{ "success": true, "errorcode" : "", "errormessage" : "", "data":[';
			for(var i = 0 ; i < results.length ; i++)
			{
				output += '{"id":"' + results[i].guid;
				output += '", "product_code":"' + results[i].productcode;
				output += '", "product_name":"' + results[i].name;
				output += '", "product_name_th":"' + results[i].Product_Name_TH__c;
				output += '", "description":"' + results[i].description;
				output += '", "brand":"' + results[i].product_group__c;
				output += '", "family":"' + results[i].family;
				output += '", "type":"' + results[i].product_type__c;
				output += '", "division":"' + results[i].division__c;
				output += '", "net_weight":"' + results[i].net_weight_g__c;
				output += '", "pack_size":"' + results[i].pack_size__c;
				output += '", "isactive":' + results[i].isactive;
				output += ', "isdeleted":' + results[i].isdeleted;
				output += ', "updateddate":"' + results[i].updatedate.replace(" ", "T") + '"},';
			}
			if(results.length)
			{
				output = output.substr(0, output.length - 1);
			}
			output += ']}';
			console.log(output);
			res.json(JSON.parse(output));
			*/
			var output = { "success": true, "errorcode" : "", "errormessage" : "", "data":[]};
			for(var i = 0 ; i < results.length ; i++)
			{
				output.data.push({"id": results[i].guid, "product_code": results[i].productcode, 
						  "product_name": results[i].name, "product_name_th": results[i].Product_Name_TH__c,
						  "product_name_th": results[i].Product_Name_TH__c, "description": results[i].description,
						  "group1": results[i].group1, "group2": results[i].group2,
						  "group3": results[i].group3, //"division": results[i].division__c,
						  "net_weight": results[i].net_weight_g__c, "pack_size": results[i].pack_size__c,
						  "image" : results[i].picture_url__c,
						  "isactive": results[i].isactive, "isdeleted": results[i].isdeleted,
						  "updateddate": results[i].updatedate.replace(" ", "T") + "+07:00" });
			}
			res.json(output);
		}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }'); })
	}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"00", "errormessage":"Authen Fail." }'); })
};
