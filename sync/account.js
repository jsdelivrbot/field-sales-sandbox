var db = require('./pghelper');

exports.sync = function(req, res, next) {
  var head = req.headers['authorization'];
  var lastsync = req.headers['lastsync'];

  auth.authen(head)
	.then(function(obj) {
		var sales = obj.nickname;
    var query = "SELECT * FROM salesforce.Account WHERE sfid IN ";
    query += "(SELECT account__c FROM salesforce.account_team__c WHERE LOWER(salesman__c) = '" + sales + "'";
    query += "' ) and systemmodstamp > '" + lastsync + "' by accountnumber asc";
    db.select(query)
    .then(function(results) {

    }) 
    .catch(next);
    res.send('{ \"status\": "success" }');
  }, function(err) { res.status(887).send("{ \"status\": \"fail\" }"); })
};
