"use strict";

var pg = require('pg'),
    //databaseURL = process.env.DATABASE_URL || 'postgres://ehuotalmpdqjvs:da48536ca63cdb9f209d7e00695d5e261441f7313b611d670bf104bbb1d24a5a@ec2-54-243-214-198.compute-1.amazonaws.com:5432/df3pgi81qfmoc7';
	databaseURL = process.env.DATABASE_URL || 'postgres://localhost:5432/d29mvfc926to6o';
/*
if (process.env.DATABASE_URL !== undefined) 
{
	pg.defaults.ssl = true;	
}
*/

exports.select = function (sql) {
	return new Promise((resolve, reject) => {
		//var pool = new pg.Pool()
		pg.connect(databaseURL, function (err, conn, done) {
			if (err) reject(err);
			try{
				conn.query(sql, function (err, result) {
					done();
					console.log(sql);
					if(err) reject(err);
					else resolve(result.rows);
				});
			}
			catch (e) {
                done();
                reject(e);
            }
		});
	});
};
