'use strict';

var warp = require('../lib/dbMysql').getInstance();

module.exports = function OnlinetaskModel() {

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
    },{
		name: 'state',
		type: 'tiny(1)',
		defaultValue: 1
    },{
        name: 'grade',
        type: 'tiny(2)',
        defaultValue: 50  
    },{
		name: 'create_time',
		type: "timestamp", 
		allowNull: true
    }], {
        table: 'think_online_task'
    });
    
    return onlineTaskMod;
};
