/**
 * A custom library to establish a database connection
 */
'use strict';
var Warp = require('mysql-warp');

var db = function () {
    return {
        warp: null,
        init: function (conf) {
            console.log('init mysql connection------------');
            var warp = Warp.create(conf);
            this.warp = warp;
            return warp;
        },
        getInstance: function() {
            return this.warp;
        } 
    };
};

module.exports = db();