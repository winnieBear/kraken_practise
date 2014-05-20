/**
 * A custom library to establish a database connection
 */
'use strict';
var mongoose = require('mongoose');

var db = function () {
    return {

        /**
         * Open a connection to the database
         * @param conf
         */
        config: function (conf) {
            var uri = 'mongodb://' + conf.host + '/' + conf.database;
            if(conf.poolSize){
                uri +='?poolSize='+conf.poolSize;
            }    
            mongoose.connect(uri);
            console.log('begin connect to '+uri);
            var db = mongoose.connection;
            db.on('error', console.error.bind(console, 'connection error:'));
            db.once('open', function callback() {
                console.log('db connection open');
            });
        }
    };
};

module.exports = db();