'use strict';
var warp = require('../lib/dbMysql').getInstance();

var async = require('async'),
		UsersModel = require('../models/mysqlTest'),
		UlevelModel = require('../models/ulevel');

module.exports = function (app) {
		var usersMod = new UsersModel(),
    		ulevelMod = new UlevelModel();


    app.get('/ulevel', function (req, res) {
				async.parallel([
			    function(callback){
			      usersMod.findAll(function(err,rows){
			      	if(err){
			      		callback(err);
			      	}else{
			      		callback(null,rows);
			      	}
			      });
			    },
			    function(callback){
		        ulevelMod.findAll(function(err,rows){
		        	if(err){
		        		callback(err);
		        	}else{
		        		callback(null,rows);
		        	}
			      });
			    }
				],
				// optional callback
				function(err, results){	
				    // the results array will equal ['one','two'] even though
				    // the second function had a shorter timeout.
				    if(err){
				    	console.log(err);
				    }else{
				    	var arrUsers = results.shift(),
				    		arrLevel = results.shift();
				    	var usersMap = {};
				    	for(var i = 0,len= arrUsers.length; i<len;i++){
				    		usersMap[arrUsers[i].id] = arrUsers[i].first_name+'.'+arrUsers[i].last_name;
				    	}
				    	for(var j = 0,len = arrLevel.length; j<len; j++){
				    		var userid = arrLevel[j].userid;
				    		var username = usersMap[userid];
				    		arrLevel[j]['username'] = username;
				    	}
			    		var data = {
								name: 'ulevel',
								level: arrLevel
							};
							res.render('ulevel', data);
					}	
				});
		});        

		app.get('/ulevel/add', function (req, res) {
				var first_name = req.param('fname'),last_name = req.param('lname');
				warp.transaction(function(err, tx) {
					if(err){
						//start transaction fail
						console.log('transaction start fail!');
					}else{
						async.waterfall([
					    function(callback){
					      usersMod.build({
					      	first_name:first_name,
					      	last_name:last_name,
					      	age:Math.round(Math.random()*100)
					      }).create(tx,function(err,rows){
					      	if(err){
					      		callback(err);
					      	}else{
					      		console.log('insert success!');
					      		console.log(JSON.stringify(rows));
					      		callback(null,rows);
					      	}
					      });
					    },//end insert users
					    function(arrUsers,callback){
				        ulevelMod.build({
				        	userid:arrUsers['id'],
				        	level:Math.round(Math.random()*100)
				        }).create(tx,function(err,rows){
				        	if(err){
				        		callback(err);
				        	}else{
				        		callback(null,rows);
				        	}
					      });
					    }//end insert level
						],
						// optional callback
						function(err, results){	
						    // the results array will equal ['one','two'] even though
						    // the second function had a shorter timeout.
						    tx.done(err, function(err) {
		                console.log(err===null ? 'tx committed' : 'tx rollbacked');
		                if(err){
		                	console.log(err);
		                }else{
		                	res.redirect('/ulevel');
		                }
		                
		            });
						});//end final callback
					}// end else
				});// end transaction 
		}); //end apt.get('ulevel/add?...')


};
