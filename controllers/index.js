'use strict';

var user = require('../lib/user');
var onlineTaskModel = require('../models/onlineTask');


module.exports = function(app) {

    var taskMod = new onlineTaskModel();


    app.get('/', function(req, res) {
        debugger;
        var data = {
            'controller': 'index',
        };
        user.init(req.session);
        if(user.isLogin()){
            data.userinfo = user.getUser();
        } 
        
        res.render('index', data);

    }); //over app.get('/',..)

};
