exports.convert = function (txtDate) {
  
  if (txtDate=='')
    return '';
  
  var data_array = txtDate.split(' '); 
  var returndata=''+;
  try{
    //if (data_array[2]!=''){
    
    //}
    
    //returndata=data_array[3]+'-'+data_array[1]+'-'+data_array[2]+' '+data_array[4]
  }catch (Exception ex){
    //can not split data
    returndata=txtDate;
  } 
  //for(var i = 0; i < data_array.length; i++){
  
  //}
  
  
  return txtDate; 
}
