'use strict';

var warp = require('../lib/dbMysql').getInstance();

module.exports = function() {
    /*
    function find(callback) {
        var _err = null;
        global.pool.getConnection(function(err, connection) {
            if (err) {
                return callback(err);
            }
            // Use the connection
            connection.query('SELECT * from users', function(err, rows) {
                // And done with the connection.
                connection.release(); // Don't use the connection here, it has been returned to the pool.
                callback(_err, {
                    name: 'mysqlTest',
                    users: rows
                });

            });
        });
    }

    return {
        find: find
    };
    */
  var UsersMod = warp.define('users', [{
        name: 'id',
        type: 'int',
        primaryKey: true,
        autoIncrement: true
    }, {
        name: 'first_name',
        type: 'varchar(20)'
    }, {
        name: 'last_name',
        type: 'varchar(20)'
    }, {
        name: 'age',
        type: 'tinyint(3)'
    }], {
        table: 'users'
    }); 
/*  UsersMod.test = function(){
    console.log('test usermod');
  }*/

  return UsersMod;
};
