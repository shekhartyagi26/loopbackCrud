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
    VALIDATOR.SEND_OTP(email, (err, valid)=>{
      if(err)
        cb(err)
      else
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
            cb(null, CONSTANT.USER_ID_NOT_FOUND)
        })
        .catch(err=> cb(err))
    })
  }
 
  User.remoteMethod('sendOTP', USER_ROUTES.SEND_OTP)


  // 3th API for Verify OTP
  User.verifyOTP = (userData, cb) => {
    VALIDATOR.VERIFY_OTP(userData, (err, success)=>{
      if(err)
        cb(err)
      else
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
              cb(null, "Invalid OTP.")
          } 
          else
            cb(null, CONSTANT.EMAIL_ID_NOT_FOUND)
        })
        .catch(err=> cb(err))
    })
    
  }
  
  User.remoteMethod('verifyOTP', USER_ROUTES.VERIFY_OTP)


  // 4th API for User Detail
  User.getUser = function(id, cb){
    VALIDATOR.GET_OR_DELETE_USER(id, (err, success)=>{
      if(err)
        cb(err)
      else
        var query = {  
          where:{ _id:id },
          fields: { id: true, email: true, name: true } 
        }
        User.findOne(query).then(user => {
          if (user)
            cb(null, user) 
          else
            cb(null, { message:CONSTANT.USER_ID_NOT_FOUND })
        })
        .catch(err=> cb(err))
    })

    
  }

  User.remoteMethod('getUser', USER_ROUTES.GET_USER)


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
        cb(null, { message:CONSTANT.USER_ID_NOT_FOUND })
    })
    .catch(err=> cb(err))
  }

  User.remoteMethod('getAllUser', USER_ROUTES.GET_ALL_USER)
  

  //6th API for Detete User
  User.deleteUser = (id, cb) => {
    VALIDATOR.GET_OR_DELETE_USER(id, (err, success)=>{
      if(err)
        cb(err)
      else
        var query = { _id:id }
        var options = { status:"DELETED" }
        User.update(query, options).then(user=> {
          if(user.count == 0)
            cb(null, CONSTANT.USER_ID_NOT_FOUND)
          else
            cb(null, CONSTANT.DELETE_USER)
        })
        .catch(err=> cb(err))
    })
  }
  
  User.remoteMethod('deleteUser', USER_ROUTES.DELETE_USER)


  // 7th API for edit User Profile
  User.editUser = (userData, cb) => {
    VALIDATOR.EDIT_USER(userData, (err, success)=>{
      if(err)
        cb(err)
      else
        var query = { _id:userData.id }
        var options = { name:userData.name }
        User.update(query , options).then(user => {
          if(user.count == 0)
            cb(null, "User id not found.")
          else
            cb(null, CONSTANT.PROFILE_UPDATE)
        })
        .catch(err=> cb(err))
    })
  }
  
  User.remoteMethod('editUser', USER_ROUTES.EDIT_USER)


  // 8th API for resetPassword Password
  User.resetPassword = (userData, cb) => {
    VALIDATOR.RESET_PASSWORD(userData, (err, success)=>{
      if(err)
        cb(err)
      else
        var { password, newPassword, email } = userData;
        var query = { where:{ email:email } }
        User.findOne(query).then(user => {
          if (user){
            COMMON.hashCompare(password, user.password, (err, match)=>{
              if(err)
                cb(err)
              else if(!match)
                cb(null, CONSTANT.PASSWORD_NOT_MATCH)
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
            cb(null, CONSTANT.EMAIL_ID_NOT_FOUND)
        })
        .catch(err=> cb(err))
    })
    
  }

  User.remoteMethod('resetPassword', USER_ROUTES.RESET_PASSWORD)


  // 9th API for Login
  User.login = (userData, cb)=>{
    
    VALIDATOR.LOGIN(userData, (err, success)=>{
      if(err)
        cb(err)
      else{
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
                  cb(null, CONSTANT.INVALID_CREDENTIALS)
              });
            }
          }
          else
            cb(null, CONSTANT.INVALID_CREDENTIALS)
        })
        .catch(err=> cb(err))
      }

    })
    
  }

  User.remoteMethod('login', USER_ROUTES.LOGIN)



}
