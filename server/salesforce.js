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
  })
}
