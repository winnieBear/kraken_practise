'use strict';


var OnlineTaskModel = require('../models/onlineTask');


module.exports = function (app) {

  var taskMod = new OnlineTaskModel();

  app.get('/listTask', function (req, res, next) {
    var data = {
      'controller': 'listTask',
    };

    var user = res.locals.login.user;
    user.needLogin(req, res);

    data.userinfo = user.getUser();
    taskMod.findAll({
      order: 'grade desc,create_time asc'
    }, function (err, rows) {
      if (err) {
        next(err);
      } else {
        data.taskList = rows;
        res.render('listTask/index', data);
      } //end else
    }); //end findAll

  }); // end apt.get('listTask')

  app.get('/listTask/toAdd', function (req, res, next) {

    var data = {
      'controller': 'listTask/toAdd',
    };
    var user = res.locals.login.user;
    user.needLogin(req, res);

    data.userinfo = user.getUser();

    res.render('listTask/toAdd', data);
  }); // end apt.get('/listTask/toAdd')

  //调整优先级
  app.get('/listTask/adjGrade', function (req, res, next) {
    var data = {
      status: 1
    };

    var taskId = req.param('taskId'),
      changeGrade = req.param('changeGrade');
    if (!taskId || !changeGrade) {
      data.msg = '输入的参数不能为空！';
      return res.format({
        json: function () {
          res.json(data);
        }
      });
    }
    taskId = parseInt(taskId, 10);
    changeGrade = parseInt(changeGrade, 10);
    if (!(taskId > 0) || !(changeGrade > 0)) {
      data.msg = '输入的参数不符合要求！';
      return res.format({
        json: function () {
          res.json(data);
        }
      });
    }
    //    console.log(taskMod);
    taskMod.adjGrade(taskId, changeGrade, function (err, rows) {
      if (err) {
        next(err);
      } else {
        data.status = 0;
        data.msg = "update success!";
        data.grade = rows.grade;
        res.format({
          json: function () {
            res.json(data);
          }
        });
      }
    })

  });

  //暂停任务
  app.get('/listTask/stop', function (req, res, next) {
    var data = {
      status: 1
    };

    var taskId = req.param('taskId');
    if (!taskId) {
      data.msg = '输入的参数不能为空！';
      return res.format({
        json: function () {
          res.json(data);
        }
      });
    }
    taskId = parseInt(taskId, 10);
    if (!(taskId > 0)) {
      data.msg = '输入的参数不符合要求！';
      return res.format({
        json: function () {
          res.json(data);
        }
      });
    }
    taskMod.stopTask(taskId, function (err, rows) {
      if (err) {
        next(err);
      } else {
        data.status = 0;
        data.msg = "stop success!";
        data.taskState = rows.state;
        res.format({
          json: function () {
            res.json(data);
          }
        });
      }
    });

  });


  //恢复任务
  app.get('/listTask/resume', function (req, res, next) {
    var data = {
      status: 1
    };

    var taskId = req.param('taskId');
    if (!taskId) {
      data.msg = '输入的参数不能为空！';
      return res.format({
        json: function () {
          res.json(data);
        }
      });
    }
    taskId = parseInt(taskId, 10);
    if (!(taskId > 0)) {
      data.msg = '输入的参数不符合要求！';
      return res.format({
        json: function () {
          res.json(data);
        }
      });
    }
    taskMod.resumeTask(taskId, function (err, rows) {
      if (err) {
        next(err);
      } else {
        data.status = 0;
        data.msg = "resume success!";
        data.taskState = rows.state;
        res.format({
          json: function () {
            res.json(data);
          }
        });
      }
    });

  });


  //取消任务
  app.get('/listTask/cancel', function (req, res, next) {
    var data = {
      status: 1
    };

    var taskId = req.param('taskId');
    if (!taskId) {
      data.msg = '输入的参数不能为空！';
      return res.format({
        json: function () {
          res.json(data);
        }
      });
    }
    taskId = parseInt(taskId, 10);
    if (!(taskId > 0)) {
      data.msg = '输入的参数不符合要求！';
      return res.format({
        json: function () {
          res.json(data);
        }
      });
    }
    taskMod.cancelTask(taskId, function (err, rows) {
      if (err) {
        next(err);
      } else {
        data.status = 0;
        data.msg = "cancel success!";
        data.taskState = rows.state;
        res.format({
          json: function () {
            res.json(data);
          }
        });
      }
    });

  });

  //添加任务
  app.post('/listTask/add', function (req, res, next) {
    var data = {
      'controller': 'listTask/toAdd',
    };
    var user = res.locals.login.user;
    user.needLogin(req, res);

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
    }).create(function (err, rows) {
      var data = {
        'controller': '/listTask/add',
      };
      if (err) {
        next(err);
      } else {
        res.redirect('/listTask');
      } //end else
    }); //end create

  }); // end app.post('/listTask/add'

  //列出所有可以执行的任务
  app.get('/listTask/getAllTask', function (req, res, next) {
    var data = {

    };
    taskMod.getAllTaskCanDo(function (err, rows) {
      if (err) {
        next(err);
      } else {
        data.taskList = rows;
        console.log(rows);
        res.send(200, 'hello');
        //res.render('listTask/index', data);
      } //end else
    }); //end getAllTaskCanDo

  });

  //列出一个可以执行的任务
  app.get('/listTask/getOneTask', function (req, res, next) {
    var data = {

    };
    taskMod.getOneTaskToDo(function (err, rows) {
      if (err) {
        next(err);
      } else {
        data.taskList = rows;
        console.log(rows);
        res.send(200, 'hello');
      }
    });

  });

};
