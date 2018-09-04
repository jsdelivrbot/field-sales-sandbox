var hostname = 'app98692077.auth0.com';
var client = 'Ko42sNQ96ngSP1KTvs6FScGHPXThIwn6';
var connection = 'Username-Password-Authentication';
var mgt_client = 'r7vMynNoisEjCY62ucVBqxKuTG25e8CK';
var mgt_secret = 'CrIww6gVyNiE9SQBKYOHDNunqInOQJBlEx7eKlFPsrA6XiJDbq3p6xQJo5yk9s05';

exports.authen = function (head, conn) {
	return new Promise((resolve, reject) => {
		//Check Token
		var query = "SELECT * FROM salesforce.cache_auth WHERE token = '" + head + "'";
		db.query(query, conn) 
		.then(function(results) {
			if(results.length > 0 && new Date(results[0].expire) > new Date())
			{
				var obj = { nickname : results[0].salesman__c };
				resolve(obj);
			}
			else
			{
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
							//Set New Token
							var query2 = "DELETE FROM salesforce.cache_auth WHERE salesman__c = '" + obj.nickname; 
							query2 += "'; INSERT INTO salesforce.cache_auth ( token, salesman__c, expire)";
							query2 += "VALUES ('" + head + "', '" + obj.nickname + "', ";
							query2 += "CURRENT_TIMESTAMP + INTERVAL '300' SECOND)";
							db.query(query2, conn) 
							.then(function(results2) {
								resolve(obj);
							}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }'); })
						}
						catch(ex) { reject(ex); }
					});
				}

				var httprequest = https.request(options, callback);
				httprequest.on('error', (e) => { reject(e); });
				httprequest.end();
			}
		}, function(err) { res.status(887).send('{ "success": false, "errorcode" :"01", "errormessage":"Cannot connect DB." }'); })
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
		var httprequest = https.request(options, callback);
		httprequest.on('error', (e) => { reject(e); });
		httprequest.write(postBody);
		httprequest.end();
	})
}

exports.delete = function (id) {
	return new Promise((resolve, reject) => {
		var https = require('https');
		var postBody = JSON.stringify({      
			'client_id': mgt_client,
			'client_secret': mgt_secret,
			'audience': 'https://' + hostname + '/api/v2/',
			'grant_type':'client_credentials'
		});

		var options = {
			  host: hostname,
			  path: '/oauth/token',
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
					console.log('Id:' + id + ', Token:' + obj.access_token);
					var https2 = require('https');
					var options2 = {
						host: hostname,
						path: '/api/v2/users/auth0|' + id,
						port: '443',
						method: 'DELETE',
						headers: { 'Authorization': 'Bearer ' + obj.access_token }
					};
					console.log(options2);
					callback2 = function(results2) {
						var str2 = '';
						results2.on('data', function(chunk2) {
							str2 += chunk2;
						});
						results2.on('end', function() {
							try
							{
								console.log(str2);				
								if(str2 == '')
								{
									console.log('Delete Success');
									resolve({'status':'Delete Success'});
								}
								else
								{
									var obj2 = JSON.parse(str2);
									resolve(obj2);
								}
							}
							catch(ex) { reject(ex); }
						});
					}
					var httprequest2 = https.request(options2, callback2);
					httprequest2.on('error', (e2) => { reject(e2); });
					httprequest2.end();
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

exports.login = function (user, pass) {
	return new Promise((resolve, reject) => {
		var https = require('https');
		var postBody = JSON.stringify({      
			'client_id': client,
			'username': user,
			'password': pass,
			'connection': connection,
			"scope" : "openid",
			"grant_type" : "password",
			"audience" : "https://" + hostname + "/api/v2/"		
		});
		var options = {
			host: hostname,
			path: '/oauth/token',
			port: '443',
			method: 'POST',
			headers: { 'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(postBody)
			}
		};
		console.log(postBody);
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
		var httprequest = https.request(options, callback);
		httprequest.on('error', (e) => { reject(e); });
		httprequest.write(postBody);
		httprequest.end();
	})
}
