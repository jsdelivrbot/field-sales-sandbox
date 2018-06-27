var hostname = 'app98692077.auth0.com';
var client = 'Ko42sNQ96ngSP1KTvs6FScGHPXThIwn6';
var connection = 'Username-Password-Authentication';


exports.authen = function (head) {
  return new Promise((resolve, reject) => {
    var https = require('https');
    var options = {
      host: hostname,
      path: '/userinfo',
      port: '443',
      method: 'GET',
      headers: { 'authorization': head }
    };

    callback = function(results) {
      var str = '';
      results.on('data', function(chunk) {
        str += chunk;
      });
      results.on('end', function() {
        try {
          console.log(str);
          var obj = JSON.parse(str);
          resolve(obj);
        }
        catch(ex) { reject(ex); }
      });
    }

    var httprequest = https.request(options, callback);
    httprequest.on('error', (e) => { reject(e); });
    httprequest.end();	
  })
}

exports.signup = function (user, email, pass) {
  return new Promise((resolve, reject) => {
    var https = require('https');
    var postBody = JSON.stringify({      
      'client_id': client,
      'username': user,
      'email': email,
      'password': pass,
      'connection': connection
    });
    var options = {
      host: hostname,
      path: '/dbconnections/signup',
      port: '443',
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postBody)
      }
    };
    callback = function(results) {
		var str = '';
		results.on('data', function(chunk) {
			str += chunk;
		});
		results.on('end', function() {
			try {
				var obj = JSON.parse(str);
        resolve(obj);
        }
        catch(ex) { reject(ex); }
      });
    }
  })
}
