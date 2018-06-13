var db = require('./server/pghelper');

function sayHello() {
    console.log('Clean Data Job');
}
sayHello();

function cleanSaleman()
{
    var query = "DELETE FROM salesforce.Salesman__c WHERE sfid in ";
    query += "(SELECT sfid FROM salesforce.Salesman__c WHERE IsDeleted = true and systemmodstamp < NOW() - interval '1 months' )";
    query += "RETURNING *";
    db.select(query)	
	.then(function(results) {
	    console.log("Clean Salesman");	
    })  
}
cleanSaleman();
