'use strict';
const common = require('../common');
const userApi = require('./userAPI');
module.exports = (User) => {

  // 1st API for Signup
  User.signup = (userData, cb)=>{
    userApi.signup(User, userData, (err, user)=>{
      if(err)
        cb(err);
      else
        cb(null, user);
    });
  };

  User.remoteMethod('signup', common.router('/signup', 'post', 'data'));
  User.beforeRemote('signup',(context, user, next)=>common.beforeRemote(context, ['name','email','password'], next));

  // 2rd API for send OTP
  User.sendOTP = (email, cb) => {
    userApi.sendOTP(User, email, (err, user)=>{
      if(err)
        cb(err);
      else
        cb(null, user);
    }); 
  };
 
  User.remoteMethod('sendOTP', common.router('/sendOTP', 'get', 'email'));
  User.beforeRemote('sendOTP',(context, user, next)=>common.beforeRemote(context, ['email'], next));

  // 3th API for Verify OTP
  User.verifyOTP = (userData, cb) => {
    userApi.verifyOTP(User, userData, (err, user)=>{
      if(err)
        cb(err);
      else
        cb(null, user);
    });
  };
  
  User.remoteMethod('verifyOTP',  common.router('/verifyOTP', 'post', 'data'))
  User.beforeRemote('verifyOTP',(context, user, next)=>common.beforeRemote(context, ['email', 'OTP'], next));


  // 4th API for User Detail
  User.getUser = function(id, cb){
    userApi.getUser(User, id, (err, user)=>{
      if(err)
        cb(err);
      else
        cb(null, user);
    });
  };

  User.remoteMethod('getUser',  common.router('/getUser', 'get', 'id'))
  User.beforeRemote('getUser', (context, user, next)=>common.beforeRemote(context, ['id'], next));


  // 5th API for get ALl User list
  User.getAllUser = function(id, cb){
    userApi.getAllUser(User, (err, user)=>{
      if(err)
        cb(err);
      else
        cb(null, user);
    });
  };

  User.remoteMethod('getAllUser', common.router('/getAllUser', 'post', 'data'))

  //6th API for Detete User
  User.deleteUser = (id, cb) => {
    userApi.deleteUser(User, id, (err, user)=>{
      if(err)
        cb(err);
      else
        cb(null, user);
    });
  };
  
  User.remoteMethod('deleteUser', common.router('/deleteUser', 'get', 'id'))
  User.beforeRemote('deleteUser',(context, user, next)=>common.beforeRemote(context, ['id'], next));


  // 7th API for edit User Profile
  User.editUser = (userData, cb) => {
    userApi.editUser(User, userData, (err, user)=>{
      if(err)
        cb(err);
      else
        cb(null, user);
    });
  };
  
  User.remoteMethod('editUser', common.router('/editUser', 'post', 'data'))
  User.beforeRemote('editUser',(context, user, next)=>common.beforeRemote(context, ['id','name'], next));


  // 8th API for resetPassword Password
  User.resetPassword = (userData, cb) => {
    userApi.resetPassword(User, userData, (err, user)=>{
      if(err)
        cb(err);
      else
        cb(null, user);
    });
  };

  User.remoteMethod('resetPassword', common.router('/resetPassword', 'post', 'data'))
  User.beforeRemote('resetPassword',(context, user, next)=>common.beforeRemote(context, ['email','password','newPassword'], next));


  // 9th API for Login
  User.login = (userData, cb)=>{ 
    userApi.login(User, userData, (err, user)=>{
      if(err)
        cb(err);
      else
        cb(null, user);
    });
  };

  User.remoteMethod('login', common.router('/login', 'post', 'data'));
  User.beforeRemote('login',(context, user, next)=>common.beforeRemote(context, ['email','password'], next));

}
