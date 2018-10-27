'use strict';
const common = require('../common');
const constant = require('../constant');
module.exports = (User) => {
  // 1st API for Signup
  User.signup = (userData, cb)=>{
    User.create(userData, (err, user)=>{
      if(err)
        cb(err)
      else
        cb(null, user)
    })
  }

  User.remoteMethod('signup', common.router('/signup', 'post', 'data'));
  User.beforeRemote('signup',(context, user, next)=>common.beforeRemote(context, ['name','email','password'], next));

  // 2rd API for send OTP
  User.sendOTP = (email, cb) => {
        let options = { OTP: constant.OTP };
        let query = { where: { "email": email } };
        User.findOne(query).then(user=> {
          if (user) {
            User.update({ _id:user.id } , options, (err, user) => {
              if (err)
                cb(err);
              else
                cb(null, constant.SEND_OTP);
            })
          } 
          else
            cb(constant.EMAIL_ID_NOT_FOUND, null);
        })
        .catch(err=> cb(err));
  }
 
  User.remoteMethod('sendOTP', common.router('/sendOTP', 'get', 'email'));
  User.beforeRemote('sendOTP',(context, user, next)=>common.beforeRemote(context, ['email'], next));

  // 3th API for Verify OTP
  User.verifyOTP = (userData, cb) => {
    let { email, OTP } = userData
    let query = { where: { email: email } }
    let options = { status: "ACTIVE" }
    User.findOne(query)
    .then(user => {
      if (user) {
        if (user.OTP == userData.OTP) {
          User.update({_id:user.id}, options, (err, user) => {
            if (err)
              cb(err);
            else
              cb(null, constant.SUCCESSFULLY_LOGIN);
          })
        } 
        else
          cb(constant.INVALID_OTP ,null);
      } 
      else
        cb(constant.EMAIL_ID_NOT_FOUND, null);
    })
    .catch(err=> cb(err));
    
  }
  
  User.remoteMethod('verifyOTP',  common.router('/verifyOTP', 'post', 'data'))
  User.beforeRemote('verifyOTP',(context, user, next)=>common.beforeRemote(context, ['email', 'OTP'], next));


  // 4th API for User Detail
  User.getUser = function(id, cb){
    let query = {  
      where:{ _id:id },
      fields: { id: true, email: true, name: true } 
    }
    User.findOne(query).then(user => {
      if (user)
        cb(null, user);
      else
        cb(constant.USER_ID_NOT_FOUND, null);
    })
    .catch(err=> cb(err));
  }

  User.remoteMethod('getUser',  common.router('/getUser', 'get', 'id'))
  User.beforeRemote('getUser', (context, user, next)=>common.beforeRemote(context, ['id'], next));


  // 5th API for get ALl User list
  User.getAllUser = function(id, cb){
    let query = {  
      where:{ status:"ACTIVE" },
      fields: { id: true, email: true, name: true } 
    }
    User.find(query).then(users => {
      if (users)
        cb(null, users) 
      else
        cb(constant.USER_ID_NOT_FOUND, null)
    })
    .catch(err=> cb(err))
  }

  User.remoteMethod('getAllUser', common.router('/getAllUser', 'post', 'data'))

  //6th API for Detete User
  User.deleteUser = (id, cb) => {
    let query = { _id:id }
    let options = { status:"DELETED" }
    User.update(query, options).then(user=> {
      if(user.count == 0)
        cb(constant.USER_ID_NOT_FOUND, null)
      else
        cb(null, constant.DELETE_USER)
    })
    .catch(err=> cb(err))
  }
  
  User.remoteMethod('deleteUser', common.router('/deleteUser', 'get', 'id'))
  User.beforeRemote('deleteUser',(context, user, next)=>common.beforeRemote(context, ['id'], next));


  // 7th API for edit User Profile
  User.editUser = (userData, cb) => {
    let query = { _id:userData.id }
    let options = { name:userData.name }
    User.update(query , options).then(user => {
      if(user.count == 0)
        cb(constant.USER_ID_NOT_FOUND)
      else
        cb(null, constant.PROFILE_UPDATE)
    })
    .catch(err=> cb(err))
  }
  
  User.remoteMethod('editUser', common.router('/editUser', 'post', 'data'))
  User.beforeRemote('editUser',(context, user, next)=>common.beforeRemote(context, ['id','name'], next));


  // 8th API for resetPassword Password
  User.resetPassword = (userData, cb) => {
    let { password, newPassword, email } = userData;
    let query = { where:{ email:email } }
    User.findOne(query).then(user => {
      if (user){
        common.hashCompare(password, user.password, (err, match)=>{
          if(err)
            cb(err)
          else if(!match)
            cb(constant.PASSWORD_NOT_MATCH, null)
          else
            common.createHash(newPassword, (err, hash)=>{
              if(err)
                cb(err)
              else{
                let options = { password:hash }
                User.update({ _id:user.id }, options, (err, user) => {
                  if (err)
                    cb(err)
                  else
                    cb(null, constant.PASSWORD_CHANGE)
                })
              }  
            })
        })
      } 
      else
        cb(constant.EMAIL_ID_NOT_FOUND, null)
    })
    .catch(err=> cb(err))
  }

  User.remoteMethod('resetPassword', common.router('/resetPassword', 'post', 'data'))
  User.beforeRemote('resetPassword',(context, user, next)=>common.beforeRemote(context, ['email','password','newPassword'], next));


  // 9th API for Login
  User.login = (userData, cb)=>{ 
    let { password, email } = userData;
    let query = { where:{ email:email } };
    User.findOne(query)
    .then(user=>{
      if(user){
        if(user.status != "ACTIVE"){
          let query = { _id:user.id };
          let options = { OTP:constant.OTP };
          User.update(query, options)
          .then(update=> cb(null, constant.SEND_OTP))
          .catch(err=> cb(err));
        } 
        else{
          common.hashCompare(password, user.password, (err, match)=>{
            if(err)
              cb(err);
            else if(match)
              cb(null, user);
            else
              cb(constant.INVALID_CREDENTIALS);
          });
        }
      }
      else
        cb(constant.INVALID_CREDENTIALS);
    })
    .catch(err=> cb(err));
  }
  User.remoteMethod('login', common.router('/login', 'post', 'data'));
  User.beforeRemote('login',(context, user, next)=>common.beforeRemote(context, ['email','password'], next));

}
