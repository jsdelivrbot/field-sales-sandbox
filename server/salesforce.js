var querystring = require('querystring');
var hostname = 'test.salesforce.com';
var SF_hostname = 'cs58.salesforce.com'
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

exports.createComposite = function (data, token) {
	return new Promise((resolve, reject) => {
		var https = require('https');
		
		var postBody = JSON.stringify(data);
		var options = {
			host: SF_hostname,
			path: '/services/data/v43.0/composite/sobjects',
			port: '443',
			method: 'POST',
			headers: { 'Authorization': token,
				   'Content-Type': 'application/json',
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

exports.updateComposite = function (data, token) {
	return new Promise((resolve, reject) => {
		var https = require('https');
		
		var postBody = JSON.stringify(data);
		var options = {
			host: SF_hostname,
			path: '/services/data/v43.0/composite/sobjects',
			port: '443',
			method: 'PATCH',
			headers: { 'Authorization': token,
				   'Content-Type': 'application/json',
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

exports.updateAccount = function (id, data, token) {
	return new Promise((resolve, reject) => {
		var https = require('https');
		
		var postBody = JSON.stringify(data);
		var options = {
			host: SF_hostname,
			path: '/services/data/v43.0/sobjects/Account/' + id,
			port: '443',
			method: 'PATCH',
			headers: { 'Authorization': token,
				   'Content-Type': 'application/json',
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
					console.log('Result : ' + str);
					console.log('Length : ' + str.length);
					if(str.length < 1) { str = '{"status": "Success"}'; }
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

exports.createContact = function (data, token) {
	return new Promise((resolve, reject) => {
		var https = require('https');
		
		var postBody = JSON.stringify(data);
		var options = {
			host: SF_hostname,
			path: '/services/data/v43.0/sobjects/Contact',
			port: '443',
			method: 'POST',
			headers: { 'Authorization': token,
				   'Content-Type': 'application/json',
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

exports.updateContact = function (id, data, token) {
	return new Promise((resolve, reject) => {
		var https = require('https');
		
		var postBody = JSON.stringify(data);
		var options = {
			host: SF_hostname,
			path: '/services/data/v43.0/sobjects/Contact/' + id,
			port: '443',
			method: 'PATCH',
			headers: { 'Authorization': token,
				   'Content-Type': 'application/json',
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
					if(str.length < 1) { str = '{"status": "Success"}'; }
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

exports.createCallVisit = function (data, token) {
	return new Promise((resolve, reject) => {
		var https = require('https');
		
		data.Plan_Start__c = new Date(data.Plan_Start__c);
		data.Plan_End__c = new Date(data.Plan_End__c);
		data.Call_Type__c = 'Unplanned';
		data.Status__c = 'On Plan';
		console.log(data);
		var postBody = JSON.stringify(data);
		var options = {
			host: SF_hostname,
			path: '/services/data/v43.0/sobjects/Call_Visit__c',
			port: '443',
			method: 'POST',
			headers: { 'Authorization': token,
				   'Content-Type': 'application/json',
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

exports.updateCallVisit = function (id, data, token) {
	return new Promise((resolve, reject) => {
		var https = require('https');
		
		data.Plan_Start__c = new Date(data.Plan_Start__c);
		data.Plan_End__c = new Date(data.Plan_End__c);
		console.log(data);
		var postBody = JSON.stringify(data);
		var options = {
			host: SF_hostname,
			path: '/services/data/v43.0/sobjects/Call_Visit__c/' + id,
			port: '443',
			method: 'PATCH',
			headers: { 'Authorization': token,
				   'Content-Type': 'application/json',
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
					if(str.length < 1) { str = '{"status": "Success"}'; }
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
