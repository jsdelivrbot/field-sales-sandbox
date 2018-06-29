var db = require('./pghelper');

exports.sync = function(req, res, next) {
  var head = req.headers['authorization'];
  var lastsync = req.headers['lastsync'];
  
  if (!req.body) return res.sendStatus(400);
  
  res.send('{ \"status\": "success" }');
};
