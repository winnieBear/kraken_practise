'use strict';

var warp = require('../lib/dbMysql').getInstance();

function OnlinetaskModel() {

  var onlineTaskMod = warp.define('onlineTask', [{
    name: 'id',
    type: 'int',
    primaryKey: true,
    autoIncrement: true
  }, {
    name: 'jira_id',
    type: 'varchar(20)',
    allowNull: false
  }, {
    name: 'build_id',
    type: 'varchar(20)',
    allowNull: false
  }, {
    name: 'email',
    type: 'varchar(255)',
    allowNull: false
  }, {
    name: 'state',
    type: 'tiny(1)',
    defaultValue: 1
  }, {
    name: 'grade',
    type: 'tiny(2)',
    defaultValue: 50
  }, {
    name: 'create_time',
    type: "timestamp",
    allowNull: true
  }], {
    table: 'think_online_task'
  }, {
    taskState: {
      'stop': 0,
      'ready': 1,
      'wait': 2,
      'running': 3,
      'done': 4,
      'fail': 5,
      'drop': 6
    },
    adjGrade: function (taskId, changeGrade, callback) {
      this.find({
          select: ['id', 'grade'],
          where: 'id=?',
          params: [taskId],
          limit: 1
        },
        function (err, rows) {
          if (err) {
            callback(err);
          } else {
            rows.grade += changeGrade;

            rows.update(
              ['grade'],
              function (err, rows) {
                if (err) {
                  callback(err);
                } else {
                  callback(null, rows);
                }
              });
          }
        });
    },
    changeState: function (taskId, state, callback) {
      this.find({
        select: ['id', 'state'],
        where: 'id=?',
        params: [taskId],
        limit: 1
      }, function (err, rows) {
        if (err) {
          callback(err);
        } else {
          rows.state = state;
          rows.update(['state'], function (err, rows) {
            if (err) {
              callback(err);
            } else {
              callback(null, rows);
            }
          })
        }
      })
    },
    stopTask: function (taskId, callback) {
      this.changeState(taskId, this.taskState['stop'], callback);
    },
    resumeTask: function (taskId, callback) {
      this.changeState(taskId, this.taskState['ready'], callback);
    },
    cancelTask: function (taskId, callback) {
      this.changeState(taskId, this.taskState['drop'], callback);
    },
    beginTask: function (taskId, callback) {
      this.changeState(taskId, this.taskState['running'], callback);
    },
    doneTask: function (taskId, callback) {
      this.changeState(taskId, this.taskState['done'], callback);
    },
    failTask: function (taskId, callback) {
      this.changeState(taskId, this.taskState['fail'], callback);
    },
    getAllTaskCanDo: function (callback) {
      this.findAll({
        where: 'state=?',
        params: [this.taskState['ready']],
        order: 'grade desc,create_time asc'
      }, function (err, rows) {
        if (err) {
          callback(err);
        } else {
          callback(null, rows);
        }
      });
    },
    getOneTaskToDo: function (callback) {
      this.find({
        where: 'state=?',
        params: [this.taskState['ready']],
        order: 'grade desc,create_time asc',
        limit: 1
      }, function (err, rows) {
        if (err) {
          callback(err);
        } else {
          callback(null, rows);
        }
      });
    }

  });

  return onlineTaskMod;
};
module.exports = OnlinetaskModel;
