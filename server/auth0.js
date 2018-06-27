var hostname = 'app98692077.auth0.com';
var client = 'Ko42sNQ96ngSP1KTvs6FScGHPXThIwn6';
var connection = 'Username-Password-Authentication';
var mgt_client = 'r7vMynNoisEjCY62ucVBqxKuTG25e8CK';
var mgt_secret = 'CrIww6gVyNiE9SQBKYOHDNunqInOQJBlEx7eKlFPsrA6XiJDbq3p6xQJo5yk9s05';

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
						host: 'app98692077.auth0.com',
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
