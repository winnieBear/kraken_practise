'use strict';

var warp = require('../lib/dbMysql').getInstance();

module.exports = function() {

    var UserModel = warp.define('User', [{
        name: 'id',
        type: 'int',
        primaryKey: true,
        autoIncrement: true
    }, {
        name: 'email',
        type: 'varchar(255)',
        allowNull: false
    }, {
        name: 'password',
        type: 'varchar(64)',
        allowNull: false
    }, {
        name: 'username',
        type: 'varchar(255)',
        allowNull: false
    },{
		name: 'create_time',
		type: "timestamp", 
		allowNull: true
    }], {
        table: 'think_user'
    });
    
    return UserModel;
};
