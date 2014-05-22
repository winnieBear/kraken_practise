'use strict';

var base64 = require('./base64');

function User(session){
    this.session = null;
    this.userInfo =  {};
}
function _loadUser(session){
    var userInfo;

    if(session['userid']){
        userInfo = {
            'userid': session.userid,
            'email':session.email,
            'username':session.username,
            'group': session.group,
            'login': true
        };
    }else{
        userInfo = {
            'userid': 0,
            'email':'',
            'username':'',
            'group': '',
            'login': false
        };
    }
    return userInfo;
}

function _removeUser(session){
    session.destroy(function(err){
        //console.log(err);
    });
}

User.prototype = {
    init:function(session){
        delete this.session;
        delete this.userInfo;
        this.session = session;
        this.userInfo = _loadUser(session);
        return this;
    },
    getUser:function(){
        return this.userInfo;
    },
    isLogin:function(){
        console.log('user info:',this.userInfo);
        return this.userInfo['login'] === true;
    },
    needLogin:function(req,res){
        if(!this.isLogin()){
            res.redirect('/user/login?ret='+base64.encode(req.url));
        }
        return true;
    },
    logout:function(){
        this.userInfo = {};
        _removeUser(this.session);
    }

}




module.exports = new User();