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
	query += req.body.cortoncode + "', '" + req.body.canheight + "', '" + req.body.canwidth + "', '" + req.body.cartonweight + "', '";
	query += req.body.container + "', '" + req.body.dimensionheight + "', '" + req.body.dimensionlength + "', '";
	query += req.body.dimensionwidth + "', '" + req.body.fda + "', '" + req.body.family + "', '" + req.body.grossweight + "', '";
	query += req.body.halal + "', '" + req.body.multipack + "', '" + req.body.netweight + "', '";
	query += req.body.packheight + "', '" + req.body.packlenght + "', '" + req.body.packsize + "', '" + req.body.packweight + "', '";
	query += req.body.packwidth + "', '" + req.body.code + "', '" + req.body.group + "', '" + req.body.image + "', '";
	query += req.body.unit + "', '" + req.body.shelflife + "', '" + req.body.shelfstall + "', '" + req.body.sizegrams + "', '";
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
