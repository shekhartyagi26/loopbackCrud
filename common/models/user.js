'use strict';
// PersistedModel
const COMMON = require('../common')
const CONSTANT = require('../constant')
const USER_ROUTES = require('../routes/userRoutes')
const VALIDATOR = require('../validations')

module.exports = (User) => {

  // 1st API for Signup
  User.signup = (userData, cb)=>{
    new User(userData)
    .save()
    .then(user=> cb(null, user))
    .catch(err=> cb(err))
  }

  User.remoteMethod('signup', USER_ROUTES.SIGNUP)  

  // 2rd API for send OTP
  User.sendOTP = (email, cb) => {
        var options = { OTP: CONSTANT.OTP }
        var query = { where: { "email": email } }
        User.findOne(query).then(user=> {
          if (user) {
            User.update({ _id:user.id } , options, (err, user) => {
              if (err)
                cb(err)
              else
                cb(null, CONSTANT.SEND_OTP)
            })
          } 
          else
            cb(CONSTANT.USER_ID_NOT_FOUND, null)
        })
        .catch(err=> cb(err))
  }
 
  User.remoteMethod('sendOTP', USER_ROUTES.SEND_OTP)

  User.beforeRemote('sendOTP', (context, user, next)=>{
    var email = context.req.body;
    VALIDATOR.SEND_OTP(email, (err, success)=>{
      if(err)
        next(err)
      else
        next()
    })
  })


  // 3th API for Verify OTP
  User.verifyOTP = (userData, cb) => {
        var { email, OTP } = userData
        var query = { where: { email: email } }
        var options = { status: "ACTIVE" }
        User.findOne(query)
        .then(user => {
          if (user) {
            if (user.OTP == userData.OTP) {
              User.update({_id:user.id}, options, (err, user) => {
                if (err)
                  cb(err)
                else
                  cb(null, CONSTANT.SUCCESSFULLY_LOGIN)
              })
            } 
            else
              cb(CONSTANT.INVALID_OTP ,null)
          } 
          else
            cb(CONSTANT.EMAIL_ID_NOT_FOUND, null)
        })
        .catch(err=> cb(err))
    
  }
  
  User.remoteMethod('verifyOTP', USER_ROUTES.VERIFY_OTP)
  User.beforeRemote('verifyOTP', (context, user, next)=>{
    var userData = context.req.body;
    VALIDATOR.VERIFY_OTP(userData, (err, success)=>{
      if(err)
        next(err)
      else
        next()
    })
  })


  // 4th API for User Detail
  User.getUser = function(id, cb){
        var query = {  
          where:{ _id:id },
          fields: { id: true, email: true, name: true } 
        }
        User.findOne(query).then(user => {
          if (user)
            cb(null, user) 
          else
            cb(CONSTANT.USER_ID_NOT_FOUND, null)
        })
        .catch(err=> cb(err))
  }

  User.remoteMethod('getUser', USER_ROUTES.GET_USER)
  User.beforeRemote('getUser', (context, user, next)=>{
    var id = context.req.query.id;;
    VALIDATOR.GET_OR_DELETE_USER(id, (err, success)=>{
      if(err)
        next(err)
      else
        next()
    })
  })


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
        cb(CONSTANT.USER_ID_NOT_FOUND, null)
    })
    .catch(err=> cb(err))
  }

  User.remoteMethod('getAllUser', USER_ROUTES.GET_ALL_USER)

  //6th API for Detete User
  User.deleteUser = (id, cb) => {
        var query = { _id:id }
        var options = { status:"DELETED" }
        User.update(query, options).then(user=> {
          if(user.count == 0)
            cb(CONSTANT.USER_ID_NOT_FOUND, null)
          else
            cb(null, CONSTANT.DELETE_USER)
        })
        .catch(err=> cb(err))
  }
  
  User.remoteMethod('deleteUser', USER_ROUTES.DELETE_USER)
  User.beforeRemote('deleteUser', (context, user, next)=>{
    var id = context.req.query.id;
    VALIDATOR.GET_OR_DELETE_USER(id, (err, success)=>{
      if(err)
        next(err)
      else
        next()
    })
  })


  // 7th API for edit User Profile
  User.editUser = (userData, cb) => {

        var query = { _id:userData.id }
        var options = { name:userData.name }
        User.update(query , options).then(user => {
          if(user.count == 0)
            cb(CONSTANT.USER_ID_NOT_FOUND)
          else
            cb(null, CONSTANT.PROFILE_UPDATE)
        })
        .catch(err=> cb(err))
  }
  
  User.remoteMethod('editUser', USER_ROUTES.EDIT_USER)
  User.beforeRemote('editUser', (context, user, next)=>{
    var userData = context.req.body;
    VALIDATOR.EDIT_USER(userData, (err, success)=>{
      if(err)
        next(err)
      else
        next()
    })
  })


  // 8th API for resetPassword Password
  User.resetPassword = (userData, cb) => {
      var { password, newPassword, email } = userData;
      var query = { where:{ email:email } }
      User.findOne(query).then(user => {
        if (user){
          COMMON.hashCompare(password, user.password, (err, match)=>{
            if(err)
              cb(err)
            else if(!match)
              cb(CONSTANT.PASSWORD_NOT_MATCH, null)
            else
              COMMON.createHash(newPassword, (err, hash)=>{
                if(err)
                  cb(err)
                else
                  var options = { password:hash }
                  User.update({ _id:user.id }, options, (err, user) => {
                    if (err)
                      cb(err)
                    else
                      cb(null, CONSTANT.PASSWORD_CHANGE)
                  })  
              })
          })
        } 
        else
          cb(CONSTANT.EMAIL_ID_NOT_FOUND, null)
      })
      .catch(err=> cb(err))
  }

  User.remoteMethod('resetPassword', USER_ROUTES.RESET_PASSWORD)
  User.beforeRemote('resetPassword', (context, user, next)=>{
    var userData = context.req.body;
    VALIDATOR.RESET_PASSWORD(userData, (err, success)=>{
      if(err)
        next(err)
      else
        next()
    })
  })


  // 9th API for Login
  User.login = (userData, cb)=>{
    
      var { password, email } = userData;
      var query = { where:{ email:email } }
      User.findOne(query)
      .then(user=>{
        if(user){
          if(user.status != "ACTIVE"){
            var query1 = { _id:user.id }
            var options = { OTP:CONSTANT.OTP }
            User.update(query1, options)
            .then(update=> cb(null, CONSTANT.SEND_OTP))
            .catch(err=> cb(err))
          } 
          else{
            COMMON.hashCompare(password, user.password, (err, match)=>{
              if(err)
                cb(err)
              else if(match)
                cb(null, CONSTANT.SUCCESSFULLY_LOGIN)
              else
                cb(CONSTANT.INVALID_CREDENTIALS, null)
            });
          }
        }
        else
          cb(CONSTANT.INVALID_CREDENTIALS, null)
      })
      .catch(err=> cb(err))
  }

  User.remoteMethod('login', USER_ROUTES.LOGIN)
  User.beforeRemote('login', (context, user, next)=>{
    var userData = context.req.body;
    VALIDATOR.LOGIN(userData, (err, success)=>{
      if(err)
        next(err)
      else
        next();
    })
  });



}
