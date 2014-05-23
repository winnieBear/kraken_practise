'use strict';


var onlineTaskModel = require('../models/onlineTask');

module.exports = function(app) {

    var taskMod = new onlineTaskModel();

    app.get('/listTask', function(req, res) {
        var data = {
            'controller': 'listTask',
        };

       var user = res.locals.login.user;
       user.needLogin(req,res);

        data.userinfo = user.getUser();

        taskMod.findAll(function(err, rows) {
            if (err) {
                res.send(503, err);
            } else {
                data.taskList = rows;
                res.render('listTask/index', data);
            } //end else
        }); //end findAll

    }); // end apt.get('listTask')

    app.get('/listTask/toAdd', function(req, res) {

        var data = {
            'controller': 'listTask/toAdd',
        };
       var user = res.locals.login.user;
       user.needLogin(req,res);

        data.userinfo = user.getUser();

        res.render('listTask/toAdd', data);
    }); // end apt.get('/listTask/toAdd')

    //调整优先级
    app.post('/listTask/adjGrade',function(req,res){
        //  get input data
        //  
    });
    app.post('/listTask/add', function(req, res) {
        var data = {
            'controller': 'listTask/toAdd',
        };
       var user = res.locals.login.user;
       user.needLogin(req,res);

        data.userinfo = user.getUser();
        //get input data
        var email = data.userinfo.email;
        var jira_id = req.param('jira_id'),
            build_id = parseInt(req.param('build_id'), 10);
        //insert    
        taskMod.build({
            jira_id: jira_id,
            build_id: build_id,
            email: email
        }).create(function(err, rows) {
            var data = {
                'controller': '/listTask/add',
            };
            if (err) {
                res.send(503, err);
            } else {
                console.log(JSON.stringify(rows));
                res.redirect('/listTask');
            } //end else


        }); //end findAll

    }); // end apt.get('listTask')
};
