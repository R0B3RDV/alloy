/**
 * HTML5 localStorage sync adapter 
 */
var _ = require("alloy/underscore")._;

function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

function Sync(model, method, opts)
{
	var name =  model.config.adapter.name;
	var data =  model.config.data;

	function storeModel(data) {
		localStorage.setItem(name, JSON.stringify(data));
	}

	switch (method) {

		case "create":
			if (!model.id) model.id = model.attributes.id = guid();
			data[model.id] = model;
	    	storeModel(data);
	    	break;   	

		case "read":
			var store = localStorage.getItem(name);
			var store_data = (store && JSON.parse(store)) || {};
            
            for (var key in store_data) {
            	var m = new model.config.Model(store_data[key]);
            	model.models.push(m);
            }
			break;

		case "update":
			data[model.id] = model;
			storeModel(data); 
			break;
		
		case "delete":
			delete data[model.id];
			storeModel(data); 
			break;
	}
}

module.exports.sync = Sync;
