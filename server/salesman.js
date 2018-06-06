var db = require('./pghelper');

exports.getInfo = function(req, res, next) {
  var deviceId = req.headers['deviceid'];
  db.select("SELECT * FROM salesforce.Salesman__c WHERE IMEI__c ='" + deviceId + "'")
  .then(function(results) {
    console.log(results);	
    res.json(results);
  })
  .catch(next);
}
