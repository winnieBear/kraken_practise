'use strict';

var onlineTaskModel = require('../models/onlineTask');


module.exports = function(app) {

    var taskMod = new onlineTaskModel();


    app.get('/', function(req, res) {
        var data = {
            'controller': 'index'
        };
        var user = res.locals.login.user;
        if(user.isLogin()){
            data.userinfo = user.getUser();
        } 
        
        res.render('index', data);

    }); //over app.get('/',..)

};
