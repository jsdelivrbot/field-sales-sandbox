"use strict";

var pg = require('pg');
    //databaseURL = process.env.DATABASE_URL || 'postgres://localhost:5432/d29mvfc926to6o';

var config = {
  user: 'tbajhbexzbnfoq',
  password: 'ffc5dfeb9be1bf0ca25211f4685e2b63bdd3faa93f72e4929d689e84d6e711cf',
  host: 'ec2-54-225-96-191.compute-1.amazonaws.com',
  port: 5432,
  database: 'd29mvfc926to6o',
  ssl: true,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
};

exports.select = function (sql) {
	return new Promise((resolve, reject) => {
		var pool = new pg.Pool(config)
		
		pool.connect(function(err, conn, done) {
			//console.log('====Connected====');
			if (err) reject(err);
			try{
				//await 
				conn.query(sql, function (err, result) {
					done();
					console.log(sql);
					if(err) reject(err);
					else resolve(result.rows);
				});
				//conn.release();
			}
			catch (e) {
                		done();
                		reject(e);
            		}
		});
		//pool.end();
	});
};


exports.init = function () {
	return new Promise((resolve, reject) => {
		var pool = new pg.Pool(config)
		
		pool.connect(function(err, conn, done) {
			if (err) reject(err);
			try{
				done();
				resolve(conn);
			}
			catch (e) {
                		done();
                		reject(e);
            		}
		});
		//pool.end();
	});
};

exports.query = function (sql, conn) {
	return new Promise((resolve, reject) => {
		conn.query(sql, function (err, result) {
			console.log(sql);
			if(err) reject(err);
			else resolve(result.rows);
		});
		//conn.release();
	});
};
