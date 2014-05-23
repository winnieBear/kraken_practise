'use strict';


var UserModel = require('../models/user');
var md5 = require('MD5');
var base64 = require('../lib/base64');

module.exports = function(app) {

    var userMod = new UserModel();

    app.get('/user', function(req, res) {
        res.redirect('/user/login');
    });

    app.get('/user/reg', function(req, res) {
        var data = {
            controller: '/user/reg'
        };
        var user = res.locals.login.user;
        var retu = '/user';
        if (user.isLogin()) {
            res.redirect(retu);
        } else {
            res.render('user/reg',data);
        } //end else
    });

    app.post('/user/reg', function(req, res) {
        var data = {
            controller: '/user/reg'
        };
        var user = res.locals.login.user;
        var retu = '/user';
        if (user.isLogin()) {
            res.redirect(retu);
        } else {
            //get input data
            var email = req.param('email'),
                username = req.param('username'),
                password = req.param('password').trim();
            // valid input data 
            // todo 
            userMod.build({
                'email': email,
                'username': username,
                'password': md5(password)
            }).create(function(err, rows) {
                if (err) {
                    console.log(err);
                } else {
                    data.msg = "注册成功，请登录！";
                    res.render('user/login', data);
                }
            }); //end create

        } //end else
    });


    app.get('/user/login', function(req, res) {
        var data = {
            controller: '/user/login'
        };
        //如果没有登录，展示登录页面；否则跳转到retu url
        var user = res.locals.login.user;
        if (user.isLogin()) {
            var retu;
            if (req.param('retu')) {
                retu = base64.decode(req.param('retu'));
            } else {
                retu = '/';
            }
            res.redirect(retu);
        } else {
            debugger;
            res.render('user/login', data);
        }//end else
    });

    app.get('/user/logout', function(req, res) {
        var data = {
            controller: '/user/logout'
        };
        //如果没有登录，展示登录页面；否则跳转到retu url
        res.locals.login.user.logout();
        var retu = '/';
        res.redirect(retu);
    });

    app.post('/user/login', function(req, res,next) {
        var data = {
            controller: '/user/login'
        };
        //如果没有登录，展示登录页面；否则跳转到retu url
        var user = res.locals.login.user;
        var retu;
        if (req.param('retu')) {
            retu = base64.decode(req.param('retu'));
        } else {
            retu = '/';
        }
        if (user.isLogin()) {
            res.redirect(retu);
        } else {
	      	//get input data
	        var email = req.param('email'),
	            password = md5(req.param('password').trim());
	        // valid input data 
	        // todo 
	        userMod.find({
	        	select:['id','username','password'],
						where:'email=?',
						params:[email],
						limit:1
	        },function(err,rows){
	        	if(err){
                    //err.message = "userMod.find fail:"+err.toString();
                    debugger;
                    next(err);
	        	}else{
	        		if(rows.password === password){
	        			//login success,write session
	        			req.session.userid = rows.id;
	        			req.session.username = rows.username;
	        			req.session.email = email;

	        			res.redirect(retu);
	        		}else{
	        			//用户名不对
	        			data.msg = "用户名或密码不对！";
	        			res.render('user/login',data);
	        		}//end else password
	        	}//end else err
	        });//end findOne
        }//end else
    });


};
