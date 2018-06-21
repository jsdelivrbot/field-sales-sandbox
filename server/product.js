var db = require('./pghelper');

exports.createProduct = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);

	var query = "INSERT INTO salesforce.Product2 ( sfid, Name, Product_Name_TH__c, Barcode__c, Carton_Code__c, ";
	query += "Can_Height_CM__c, Can_Width_CM__c, Carton_Weight_KG__c, Container__c, Dimension_Height_CM__c, ";
	query += "Dimension_Length_CM__c, Dimension_Width_CM__c, FDA__c, Family, Gross_Weight_KG__c, Halal__c, ";
	query += "Multipack__c, Net_Weight_G__c, Pack_Height_CM__c, Pack_Length_CM__c, Pack_Size__c, Pack_Weight_KG__c, ";
	query += "Pack_Width_CM__c, ProductCode, Product_Group__c, Product_Image__c, QuantityUnitOfMeasure, ";
	query += "Shelf_Life__c, Shelf_Stall__c, Size_in_Grams__c, StockKeepingUnit, createddate, systemmodstamp, ";
	query += "IsDeleted ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.name + "', '" + req.body.nameth + "', '" + req.body.barcode + "', '";
	query += req.body.cartoncode + "', '" + req.body.canheight + "', '" + req.body.canwidth + "', '" + req.body.cartonweight + "', '";
	query += req.body.container + "', '" + req.body.dimensionheight + "', '" + req.body.dimensionlength + "', '";
	query += req.body.dimensionwidth + "', '" + req.body.fda + "', '" + req.body.family + "', '" + req.body.grossweight + "', '";
	query += req.body.halal + "', '" + req.body.multipack + "', '" + req.body.netweight + "', '";
	query += req.body.packheight + "', '" + req.body.packlength + "', '" + req.body.packsize + "', '" + req.body.packweight + "', '";
	query += req.body.packwidth + "', '" + req.body.code + "', '" + req.body.group + "', '" + req.body.image + "', '";
	query += req.body.unit + "', '" + req.body.shelflife + "', '" + req.body.shelfstall + "', '" + req.body.sizeingrams + "', '";
	query += req.body.sku + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.updateProduct = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);

	var query = "UPDATE salesforce.Product2 SET ";
	query += "Name = '" + req.body.name + "', ";
	query += "Product_Name_TH__c = '" + req.body.nameth + "', ";
	query += "ProductCode = '" + req.body.code + "', ";
	query += "Product_Group__c = '" + req.body.group + "', ";
	query += "Product_Image__c = '" + req.body.image + "', ";
	query += "FDA__c = '" + req.body.fda + "', ";
	query += "Family = '" + req.body.family + "', ";
	query += "StockKeepingUnit = '" + req.body.sku + "', ";
	query += "QuantityUnitOfMeasure = '" + req.body.unit + "', ";
	query += "Gross_Weight_KG__c = '" + req.body.grossweight + "', ";
	query += "Net_Weight_G__c = '" + req.body.netweight + "', ";
	query += "Size_in_Grams__c = '" + req.body.sizeingrams + "', ";
	query += "Halal__c = '" + req.body.halal + "', ";
	query += "Multipack__c = '" + req.body.multipack + "', ";
	query += "Barcode__c = '" + req.body.barcode + "', ";
	query += "Carton_Code__c = '" + req.body.cartoncode + "', ";
	query += "Container__c = '" + req.body.container + "', ";
	query += "Carton_Weight_KG__c = '" + req.body.cartonweight + "', ";
	query += "Can_Height_CM__c = '" + req.body.canheight + "', ";
	query += "Can_Width_CM__c = '" + req.body.canwidth + "', ";
	query += "Dimension_Height_CM__c = '" + req.body.dimensionheight + "', ";
	query += "Dimension_Length_CM__c = '" + req.body.dimensionlength + "', ";
	query += "Dimension_Width_CM__c = '" + req.body.dimensionwidth + "', ";	
	query += "Pack_Size__c = '" + req.body.packsize + "', ";
	query += "Pack_Height_CM__c = '" + req.body.packheight + "', ";
	query += "Pack_Length_CM__c = '" + req.body.packlength + "', ";
	query += "Pack_Weight_KG__c = '" + req.body.packweight + "', ";
	query += "Pack_Width_CM__c = '" + req.body.packwidth + "', ";
	query += "Shelf_Life__c = '" + req.body.shelflife + "', ";
	query += "Shelf_Stall__c = '" + req.body.shelfstall + "', ";
	query += "systemmodstamp = CURRENT_TIMESTAMP, ";
	query += "Isdeleted = '" + req.body.isdeleted +"' ";
	query += "WHERE sfid = '" + id + "'";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.deleteProduct = function(req, res, next) {
	var id = req.params.id;
	//var query = "DELETE FROM salesforce.Product2 WHERE sfid = '" + id + "'";	
	var query = "UPDATE salesforce.Product2 SET IsDeleted = true, systemmodstamp = CURRENT_TIMESTAMP WHERE sfid ='" + id + "'"; 
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.getList = function(req, res, next) {
	var head = req.headers['authorization'];
	var limit = req.headers['limit'];
	var start = req.headers['start'];
	
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
				var query = "SELECT * FROM salesforce.Product2 ";
				if(!isNaN(limit))
				{
					query += " limit " + limit;
				}
				if(!isNaN(start) && start != 0)
				{
					query += " OFFSET  " + start;
				}
				console.log(query);
				db.select(query)
				.then(function(results) {
					var productList = "(";
					for(var i = 0 ; i < results.length ; i++)
					{
						productList += "'" + results[i].sfid + "', ";
					}
					productList = productList.substr(0, productList.length - 2);
					productList += ")";
					
					var output = '{"Product":[';
					for(var i = 0 ; i < results.length ; i++)
					{
						
					}
					output += '], "Pricebook":[';
					
					var query2 = "SELECT * FROM salesforce.Pricebook2";
					console.log(query2);
					db.select(query2)
					.then(function(results2) {
						var query3 = "SELECT * FROM salesforce.pricebook_entry__c WHERE product__c IN " + productList;
						console.log(query3);
						db.select(query3)
						.then(function(results3) {
							var enetryList = "(";
							for(var j = 0 ; j < results3.length ; j++)
							{
								enetryList += "'" + results3[j].sfid + "', ";
							}
							enetryList = enetryList.substr(0, enetryList.length - 2);
							enetryList += ")";
						
							var query4 = "SELECT * FROM salesforce.scale_price__c WHERE pricebook_entry__c IN " + enetryList;;
							console.log(query4);
							db.select(query4)
							.then(function(results4) {
								
								
								output += ']}';
								res.send("Product");
							})
							.catch(next);
						}) 
						.catch(next);
					}) 
					.catch(next);
				}) 
				.catch(next);
			}
			catch(ex) { res.status(887).send("{ \"status\": \"fail\" }"); }
		});
	}
			
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();	
};
