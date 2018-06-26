exports.authen = function () {
  return new Promise((resolve, reject) => {
    var https = require('https');
    var options = {
      host: 'app98692077.auth0.com',
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
