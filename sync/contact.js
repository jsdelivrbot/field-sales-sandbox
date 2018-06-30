var db = require('../server/pghelper');
//var fs = require('fs');

exports.sync = function(req, res, next) {
	var head = req.headers['authorization'];
	var lastsync = req.headers['lastsync'];

	auth.authen(head)
	.then(function(obj) {
		var sales = obj.nickname;
		var query = "SELECT * FROM salesforce.Account WHERE sfid IN ";
		query += "(SELECT account__c FROM salesforce.account_team__c WHERE LOWER(salesman__c) = '" + sales + "'";
		query += "' ) by accountnumber asc";
		db.select(query) 
		.then(function(results) {
			if(results.length > 0)
			{
				var accountList = "(";
				for(var i = 0 ; i < results.length ; i++)
				{
					accountList += "'" + results[i].sfid + "', ";
				}
				accountList = accountList.substr(0, accountList.length - 2);
				accountList += ")";
				
				var query2 = "SELECT * FROM salesforce.Contact WHERE systemmodstamp > '" + lastsync + "' ";
				query2 += "and accountId IN " + accountList;
				console.log(query2);
				db.select(query2)
				.then(function(results2) {
				      /*
					fs.writeFile("/data/contact" + Date.now() + ".json", req.body, function(err) {
					    if(err) { return console.log(err); }
					    console.log("The file was saved!");
					}); 
					*/
				      //res.json(JSON.parse(output));
				      res.send("Finish!!");
				}) 
				.catch(next);
			}
		}) 
		.catch(next);
	}, function(err) { res.status(887).send("{ \"status\": \"fail\" }"); })
};
