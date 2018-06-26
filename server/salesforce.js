var querystring = require('querystring');
var hostname = 'test.salesforce.com';
var clientId = '3MVG99S6MzYiT5k9JoKu1gD1XepU0fFGE_cjs7rc3m2trKegyWnlmuL_c4W4Z4S_JBEoIRxfVN9SzbE8ZH3f1';
var clientSecret = '8905248785196363462';
var user = 'itthiphum.l@thaiunion.com.dev';
var pass = 'apassword11ovxQJr78JijI9xHLO11JnNjn';

exports.authen = function () {
	return new Promise((resolve, reject) => {
		var https = require('https');
		
		var postBody = querystring.stringify({      
			'grant_type': 'password',
			'client_id': clientId,
			'client_secret': clientSecret,
			'username': user,
			'password': pass
		});
		var options = {
			host: hostname,
			path: '/services/oauth2/token',
			port: '443',
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded',
				   'Content-Length': postBody.length
				 }
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
		httprequest.write(postBody);
		httprequest.end();
	})
}
