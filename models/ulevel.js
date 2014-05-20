'use strict';
var warp = require('../lib/dbMysql').getInstance();

module.exports = function UlevelModel() {
 
  var UlevelMod = warp.define('ulevel', [{
        name: 'id',
        type: 'int',
        primaryKey: true,
        autoIncrement: true
    }, {
        name: 'userid',
        type: 'int'
    }, {
        name: 'level',
        type: 'int'
    }], {
        table: 'level'
    }); 
/*  UsersMod.test = function(){
    console.log('test usermod');
  }*/

  return UlevelMod;
};