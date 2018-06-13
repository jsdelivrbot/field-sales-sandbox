var db = require('./server/pghelper');

function sayHello() {
    console.log('Clean Data Job');
}
sayHello();

function cleanScalePrice()
{
    var query = "DELETE FROM salesforce.Scale_Price__c WHERE sfid in ";
    query += "(SELECT sfid FROM salesforce.Scale_Price__c WHERE IsDeleted = true and systemmodstamp < NOW() - interval '1 months' )";
    query += "RETURNING *";
    db.select(query)	
	.then(function(results) {
	    console.log("Clean Scale Price Start!!");
	    console.log(results);	
    })  
}
cleanScalePrice();

function cleanPricebookentry()
{
    var query = "DELETE FROM salesforce.pricebook_entry__c WHERE sfid in ";
    query += "(SELECT sfid FROM salesforce.pricebook_entry__c WHERE IsDeleted = true and systemmodstamp < NOW() - interval '1 months' )";
    query += "RETURNING *";
    db.select(query)	
	.then(function(results) {
	    console.log("Clean Pricebook Entry Start!!");
	    console.log(results);	
	    //update order line item that use this pricebookentry
    })  
}
cleanPricebookentry();

function cleanPricebook()
{
    var query = "DELETE FROM salesforce.pricebook2 WHERE sfid in ";
    query += "(SELECT sfid FROM salesforce.pricebook2 WHERE IsDeleted = true and systemmodstamp < NOW() - interval '1 months' )";
    query += "RETURNING *";
    db.select(query)	
	.then(function(results) {
	    console.log("Clean Pricebook Start!!");
	    console.log(results);	
	    //update pricebookentry that use this pricebook
    })  
}
cleanPricebook();

function cleanProduct()
{
    var query = "DELETE FROM salesforce.product2 WHERE sfid in ";
    query += "(SELECT sfid FROM salesforce.product2 WHERE IsDeleted = true and systemmodstamp < NOW() - interval '1 months' )";
    query += "RETURNING *";
    db.select(query)	
	.then(function(results) {
	    console.log("Clean Product Start!!");
	    console.log(results);	
	    //update pricebookentry that use this product
    })  
}
cleanProduct();

function cleanSaleman()
{
    var query = "DELETE FROM salesforce.Salesman__c WHERE sfid in ";
    query += "(SELECT sfid FROM salesforce.Salesman__c WHERE IsDeleted = true and systemmodstamp < NOW() - interval '1 months' )";
    query += "RETURNING *";
    db.select(query)	
	.then(function(results) {
	    console.log("Clean Salesman Start!!");
	    console.log(results);
	    //update account team that use this salesman
    })  
}
cleanSaleman();

function cleanAccountTeam()
{
    var query = "DELETE FROM salesforce.Account_Team__c WHERE sfid in ";
    query += "(SELECT sfid FROM salesforce.Account_Team__c WHERE IsDeleted = true and systemmodstamp < NOW() - interval '1 months' )";
    query += "RETURNING *";
    db.select(query)	
	.then(function(results) {
	    console.log("Clean Account Team Start!!");
	    console.log(results);	
    })  
}
cleanAccountTeam();

function cleanContact()
{
    var query = "DELETE FROM salesforce.Contact WHERE sfid in ";
    query += "(SELECT sfid FROM salesforce.Contact WHERE IsDeleted = true and systemmodstamp < NOW() - interval '1 months' )";
    query += "RETURNING *";
    db.select(query)	
	.then(function(results) {
	    console.log("Clean Contact Start!!");
	    console.log(results);	
	    //update account that use this contact
    })  
}
cleanContact();

function cleanTopStoreProgram()
{
    var query = "DELETE FROM salesforce.Top_Store_Program__c WHERE sfid in ";
    query += "(SELECT sfid FROM salesforce.Top_Store_Program__c WHERE IsDeleted = true and systemmodstamp < NOW() - interval '1 months' )";
    query += "RETURNING *";
    db.select(query)	
	.then(function(results) {
	    console.log("Clean Top Store Program Start!!");
	    console.log(results);	
    })  
}
cleanTopStoreProgram();

function cleanInvoice()
{
    var query = "DELETE FROM salesforce.Invoice__c WHERE sfid in ";
    query += "(SELECT sfid FROM salesforce.Invoice__c WHERE IsDeleted = true and systemmodstamp < NOW() - interval '1 months' )";
    query += "RETURNING *";
    db.select(query)	
	.then(function(results) {
	    console.log("Clean Invoice Start!!");
	    console.log(results);	
    })  
}
cleanInvoice();

function cleanCallVisit()
{
    var query = "DELETE FROM salesforce.Call_Visit__c WHERE sfid in ";
    query += "(SELECT sfid FROM salesforce.Call_Visit__c WHERE IsDeleted = true and systemmodstamp < NOW() - interval '1 months' )";
    query += "RETURNING *";
    db.select(query)	
	.then(function(results) {
	    console.log("Clean Call Visit Start!!");
	    console.log(results);
	    //Remove All Call Card and Good Return Under this Call Visit
	    //Update Order that use this Call Visit
    })  
}
cleanCallVisit();


