exports.authen = function () {
	return new Promise((resolve, reject) => {
		var https = require('https');
		
		var postBody = JSON.stringify({      
			'grant_type': 'password',
			'client_id': '3MVG99S6MzYiT5k9JoKu1gD1XepU0fFGE_cjs7rc3m2trKegyWnlmuL_c4W4Z4S_JBEoIRxfVN9SzbE8ZH3f1',
			'client_secret': '8905248785196363462',
			'username': 'itthiphum.l@thaiunion.com.dev',
			'password': 'apassword11ovxQJr78JijI9xHLO11JnNjn'
		});
		var options = {
			host: 'test.salesforce.com',
			path: '/services/oauth2/token',
			port: '443',
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded',
				   'Content-Length': Buffer.byteLength(postBody)
				 }
		};
		options = {
			host: 'field-sales-sandbox.herokuapp.com',
			path: '/',
			port: '443',
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded',
				   'Content-Length': Buffer.byteLength(postBody)
				 }
		};
		callback = function(results) {
			var str = '';
			console.log(results);
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
