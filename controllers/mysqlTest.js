'use strict';


var MysqltestModel = require('../models/mysqlTest');


module.exports = function (app) {

    var usersMod = new MysqltestModel();


    app.get('/mysqlTest', function (req, res) {
			usersMod.findAll(function(err,rows){
				if(err){
					console.log(err);
					return false;
				}else{
					//console.log(JSON.stringify(rows));
					var data = {
						name: 'mysqlTest',
	          users: rows
	        };
					res.render('mysqlTest', data);
				}
				
			})        
        
        
    });

};
