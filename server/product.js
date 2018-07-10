var db = require('./pghelper');
var auth = require('./auth0');

exports.createProduct = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	
	req.body.name = req.body.name.replace(/'/g, "\\'");
	req.body.name = req.body.name.replace(/"/g, '\\"');				      
	var query = "INSERT INTO salesforce.Product2 ( sfid, Name, Product_Name_TH__c, Barcode__c, Carton_Code__c, ";
	query += "Can_Height_CM__c, Can_Width_CM__c, Carton_Weight_KG__c, Container__c, Dimension_Height_CM__c, ";
	query += "Dimension_Length_CM__c, Dimension_Width_CM__c, FDA__c, Family, Gross_Weight_KG__c, Halal__c, ";
	query += "Multipack__c, Net_Weight_G__c, Pack_Height_CM__c, Pack_Length_CM__c, Pack_Size__c, Pack_Weight_KG__c, ";
	query += "Pack_Width_CM__c, ProductCode, Product_Group__c, Picture_URL__c, QuantityUnitOfMeasure, ";
	query += "Shelf_Life__c, Shelf_Stall__c, Size_in_Grams__c, StockKeepingUnit, createddate, systemmodstamp, ";
	query += "IsDeleted, guid, Description, Product_Type__c, IsActive ) VALUES ('";
	query += req.body.sfid + "', '" + req.body.name + "', '" + req.body.nameth + "', '" + req.body.barcode + "', '";
	query += req.body.cartoncode + "', " + req.body.canheight + ", " + req.body.canwidth + ", " + req.body.cartonweight + ", '";
	query += req.body.container + "', " + req.body.dimensionheight + ", " + req.body.dimensionlength + ", ";
	query += req.body.dimensionwidth + ", '" + req.body.fda + "', '" + req.body.family + "', " + req.body.grossweight + ", '";
	query += req.body.halal + "', '" + req.body.multipack + "', " + req.body.netweight + ", ";
	query += req.body.packheight + ", " + req.body.packlength + ", '" + req.body.packsize + "', " + req.body.packweight + ", ";
	query += req.body.packwidth + ", '" + req.body.code + "', '" + req.body.group + "', '" + req.body.image + "', '";
	query += req.body.unit + "', '" + req.body.shelflife + "', " + req.body.shelfstall + ", " + req.body.sizeingrams + ", '";
	query += req.body.sku + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, '" + req.body.sfid + "', '";
	query += req.body.description + "', '" + req.body.type + "', " + req.body.isactive +")";
	console.log(query);

	db.select(query)
	.then(function(results) {
		res.send('{ \"status\": "success" }');
	})
	.catch(next);
};

exports.createProductList = function(req, res, next) {
	if (!req.body) return res.sendStatus(400);
	
	req.body.name = req.body.name.replace(/'/g, "\\'");
	req.body.name = req.body.name.replace(/"/g, '\\"');				      
	var query = "INSERT INTO salesforce.Product2 ( sfid, Name, Product_Name_TH__c, Barcode__c, Carton_Code__c, ";
	query += "Can_Height_CM__c, Can_Width_CM__c, Carton_Weight_KG__c, Container__c, Dimension_Height_CM__c, ";
	query += "Dimension_Length_CM__c, Dimension_Width_CM__c, FDA__c, Family, Gross_Weight_KG__c, Halal__c, ";
	query += "Multipack__c, Net_Weight_G__c, Pack_Height_CM__c, Pack_Length_CM__c, Pack_Size__c, Pack_Weight_KG__c, ";
	query += "Pack_Width_CM__c, ProductCode, Product_Group__c, Picture_URL__c, QuantityUnitOfMeasure, ";
	query += "Shelf_Life__c, Shelf_Stall__c, Size_in_Grams__c, StockKeepingUnit, createddate, systemmodstamp, ";
	query += "IsDeleted, guid, Description, Product_Type__c, IsActive ) VALUES ";
	for(var i = 0 ; i < req.body.length ; i++)
	{
		query += "('" + req.body[i].sfid + "', '" + req.body[i].name + "', '" + req.body[i].nameth + "', '";
		query += req.body[i].barcode + "', '" + req.body[i].cartoncode + "', " + req.body[i].canheight + ", ";
		query += req.body[i].canwidth + ", " + req.body[i].cartonweight + ", '" + req.body[i].container + "', ";
		query += req.body[i].dimensionheight + ", " + req.body[i].dimensionlength + ", " + req.body[i].dimensionwidth + ", '";
		query += req.body[i].fda + "', '" + req.body[i].family + "', " + req.body[i].grossweight + ", '";
		query += req.body[i].halal + "', '" + req.body[i].multipack + "', " + req.body[i].netweight + ", ";
		query += req.body[i].packheight + ", " + req.body[i].packlength + ", '" + req.body[i].packsize + "', ";
		query += req.body[i].packweight + ", " + req.body[i].packwidth + ", '" + req.body[i].code + "', '";
		query += req.body[i].group + "', '" + req.body[i].image + "', '" + req.body[i].unit + "', '";
		query += req.body[i].shelflife + "', " + req.body[i].shelfstall + ", " + req.body[i].sizeingrams + ", '";
		query += req.body[i].sku + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, '" + req.body[i].sfid + "', '";
		query += req.body[i].description + "', '" + req.body[i].type + "', " + req.body[i].isactive +"), ";
	}
	if(req.body.length > 0 )
	{
		query = query.substr(0, query.length - 2);
		console.log(query);

		db.select(query)
		.then(function(results) {
			res.send('{ \"status\": "success" }');
		})
		.catch(next);
	}
	else { res.send('{ \"status\": "no data" }'); }
};

exports.updateProduct = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);

	var query = "UPDATE salesforce.Product2 SET ";
	query += "Name = '" + req.body.name + "', ";
	query += "Product_Name_TH__c = '" + req.body.nameth + "', ";
	query += "ProductCode = '" + req.body.code + "', ";
	query += "Product_Group__c = '" + req.body.group + "', ";
	query += "Picture_URL__c = '" + req.body.image + "', ";
	query += "FDA__c = '" + req.body.fda + "', ";
	query += "Family = '" + req.body.family + "', ";
	query += "Product_Type__c = '" + req.body.type + "', ";
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
	query += "Description = '" + req.body.description + "', ";
	query += "systemmodstamp = CURRENT_TIMESTAMP, ";
	query += "IsActive = " + req.body.isactive + ", ";
	query += "Isdeleted = " + req.body.isdeleted +" ";
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

exports.getProducts = function(req, res, next) {
	var head = req.headers['authorization'];
	var limit = req.headers['limit'];
	var start = req.headers['start'];
	var startdate = req.headers['start-date'];
	
	auth.authen(head)
	.then(function(obj) {
		var query = "SELECT * FROM salesforce.Product2 WHERE IsActive = true and";
		if(startdate != null)
		{
			query += " createddate > '" + startdate;
		}
		if(!isNaN(limit) && limit > 0)
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

			var output = '[';
			for(var i = 0 ; i < results.length ; i++)
			{
				output += '{"sfid":"' + results[i].sfid;
				output += '", "Code":"' + results[i].productcode;
				output += '", "Barcode":"' + results[i].barcode__c;
				output += '", "Name":"' + results[i].name;
				output += '", "NameTH":"' + results[i].product_name_th__c;
				output += '", "Unit":"' + results[i].quantityunitofmeasure;
				output += '", "PackSize":"' + results[i].pack_size__c;
				output += '", "ShelfLife":"' + results[i].shelf_life__c;
				output += '", "SizeInGrams":"' + results[i].size_in_grams__c;
				output += '", "Product_Group__c":"' + results[i].product_group__c;
				output += '", "Family":"' + results[i].family;
				output += '", "Product_Type__c":"' + results[i].type;
				output += '", "Description":"' + results[i].description;
				var url = results[i].picture_url__c == null ? '' : results[i].picture_url__c;
				url = url.replace(/"/g, '\\"');
				output += '", "Image":"' + url;
				output += '", "Active":' + results[i].isactive;
				output += ', "IsDeleted":' + results[i].isdeleted;
				output += ', "systemmodstamp":"' + results[i].systemmodstamp + '"},';
			}
			if(results.length> 0)
			{
				output = output.substr(0, output.length - 1);
			}
			output += ']';
			console.log(output);
			res.json(JSON.parse(output));
		}) 
		.catch(next);
	}, function(err) { res.status(887).send("{ \"status\": \"fail\" }"); })
};

exports.getPrices = function(req, res, next) {
	var head = req.headers['authorization'];
	var limit = req.headers['limit'];
	var start = req.headers['start'];
	var startdate = req.headers['start-date'];
	
	auth.authen(head)
	.then(function(obj) {
		var query = "SELECT * FROM salesforce.Product2 ";
		if(startdate != null)
		{
			query += "WHERE createddate > '" + startdate;
		}
		if(!isNaN(limit) && limit > 0)
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
			/*
			var output = '{"Product":[';
			for(var i = 0 ; i < results.length ; i++)
			{
				output += '{"sfid":"' + results[i].sfid;
				output += '", "Code":"' + results[i].productcode;
				output += '", "Barcode":"' + results[i].barcode__c;
				output += '", "Name":"' + results[i].name;
				output += '", "NameTH":"' + results[i].product_name_th__c;
				output += '", "Unit":"' + results[i].quantityunitofmeasure;
				output += '", "PackSize":"' + results[i].pack_size__c;
				output += '", "ShelfLife":"' + results[i].shelf_life__c;
				output += '", "SizeInGrams":"' + results[i].size_in_grams__c;
				var url = results[i].product_image__c == null ? '' : results[i].product_image__c;
				url = url.replace(/"/g, '\\"');
				output += '", "Image":"' + url;
				output += '", "Active":' + results[i].isactive;
				output += ', "IsDeleted":' + results[i].isdeleted;
				output += ', "systemmodstamp":"' + results[i].systemmodstamp + '"},';
			}
			if(results.length> 0)
			{
				output = output.substr(0, output.length - 1);
			}
			output += '], "Pricebook":[';
			*/
			var output = '[';
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

					var query4 = "SELECT * FROM salesforce.scale_price__c WHERE pricebook_entry__c IN " + enetryList;
					console.log(query4);
					db.select(query4)
					.then(function(results4) {

						for(var l1 = 0 ; l1 < results2.length ; l1++)
						{
							output += '{ "sfid":"' + results2[l1].sfid;
							output += '", "Name":"' + results2[l1].name;
							var entry = '';
							for(var l2 = 0 ; l2 < results3.length ; l2++)
							{
								if(results2[l1].sfid == results3[l2].price_book__c)
								{
									entry += '{"sfid":"' + results3[l2].sfid;
									entry += '", "Product":"' + results3[l2].product__c;
									var price = '';
									for(var l3 = 0 ; l3 < results4.length ; l3++)
									{
										if(results3[l2].sfid == results4[l3].pricebook_entry__c)
										{
											price += '{"sfid":"' + results4[l3].sfid;
											price += '", "ListPrice":' + results4[l3].list_price__c;
											price += ', "NormalDiscount":' + results4[l3].normal_discount__c;
											var ltp = results4[l3].list_price__c - results4[l3].normal_discount__c;
											price += ', "LTP":' + ltp;
											price += ', "Quantity":' + results4[l3].quantity__c;
											price += ', "Discount":' + results4[l3].discount__c;
											var netprice = ltp - results4[l3].discount__c;
											price += ', "NetPrice":' + netprice;
											price += ', "FOC":' + results4[l3].foc__c;
											price += ', "IsDeleted":' + results4[l3].isdeleted;
											price += ', "systemmodstamp":"' + results4[l3].systemmodstamp + '"},';
										}
									}
									if(price.length > 0)
									{
										price = price.substr(0, price.length - 1);
									}
									entry += '", "Price":[' + price;
									entry += '], "IsDeleted":' + results3[l2].isdeleted;
									entry += ', "systemmodstamp":"' + results3[l2].systemmodstamp + '"},';
								}
							}
							if(entry.length > 0)
							{
								entry = entry.substr(0, entry.length - 1);
							}
							output += '", "Product":[' + entry;
							output += '], "Active":' + results2[l1].isactive;
							output += ', "IsDeleted":' + results2[l1].isdeleted;
							output += ', "systemmodstamp":"' + results2[l1].systemmodstamp + '"},';
						}
						if(results2.length > 0)
						{
							output = output.substr(0, output.length - 1);
						}
						//output += ']}';
						output += ']';
						console.log(output);
						res.json(JSON.parse(output));
					})
					.catch(next);
				}) 
				.catch(next);
			}) 
			.catch(next);
		}) 
		.catch(next);
	}, function(err) { res.status(887).send("{ \"status\": \"fail\" }"); })	
};
