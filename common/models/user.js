'use strict';
// PersistedModel
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (User) => {

  // 1st API for Signup
  User.signup = (userData, cb)=>{
    var user = new User(userData)
    user
    .save()
    .then(user=> cb(null, user))
    .catch(err=> cb(err))
  }

  let signup = {
    http:{ path:'/signup', verb:"post" },
    accepts:{ arg:'data', type:"object", http:{ source:"body" } },
    returns:{ arg:"data", type:"object" }
  }

  User.remoteMethod('signup', signup)  

  // 2rd API for send OTP
  User.sendOTP = (email, cb) => {

    let OTP = Math.floor(100000 + Math.random() * 900000)
    let options = { OTP: OTP }
    let query = { where: { "email": email } }
    User.findOne(query).then(result=> {
      if (result) {
        User.update({ _id:result.id } , options, (err, user) => {
          if (err)
            cb(err)
          else
            cb(null, "An OTP hase been sent on you registered email address.")
        })
      } 
      else
        cb(null, "Invalid user id.")
    })
    .catch(err=> cb(err))
  }
  let sendOTP = { 
      http: { path: '/sendOTP', verb: "post" },
      accepts: { arg: 'email', type: "string", http: { source: "query" } },
      returns: { arg: "message", type: "string" }
  }
  User.remoteMethod('sendOTP', sendOTP)



  // 3th API for Verify OTP
  User.verifyOTP = (data, cb) => {
    let { email, OTP } = data
    let query = { where: { email: email } }
    let options = { status: "ACTIVE" }
    User.findOne(query)
    .then(result => {
      if (result) {
        if (result.OTP == data.OTP) {
          User.update({_id:result.id}, options, (err, user) => {
            if (err)
              cb(err)
            else
              cb(null, "You have successfully login.")
          })
        } 
        else
          cb(null, "Invalid OTP.")
      } 
      else
        cb(null, "Email id not regisetered.")
    })
    .catch(err=> cb(err))
  }
  let verifyOTP = { 
    http: { path: '/verifyOTP', verb: "post" },
    accepts: { arg: 'data', type: "object", http: { source: "body" } },
    returns: { arg: "message", type: "string" }
  }
  User.remoteMethod('verifyOTP', verifyOTP)


  // 4th API for User Detail

  User.getUser = function(id, cb){
    let query = {  
      where:{ _id:id },
      fields: { id: true, email: true, name: true } 
    }
    User.findOne(query).then(result => {
      if (result)
        cb(null, result) 
      else
        cb(null, { message:"Invalid user id." })
    })
    .catch(err=> cb(err))
  }

  let getUser = { 
    http: { path: '/getUser', verb: "get" },
    accepts: { arg: 'id', type: "string", http: { source: "query" } },
    returns: { arg: "data", type: "object" }
  }

  User.remoteMethod('getUser', getUser)


  // 5th API for get ALl User list

  User.getAllUser = function(id, cb){
    let query = {  
      where:{ status:"ACTIVE" },
      fields: { id: true, email: true, name: true } 
    }
    User.find(query).then(result => {
      if (result)
        cb(null, result) 
      else
        cb(null, { message:"Invalid user id." })
    })
    .catch(err=> cb(err))
  }

  let getAllUser = { 
    http: { path: '/getAllUser', verb: "get" },
    accepts: { arg: 'filter', type: "string", http: { source: "query" } },
    returns: { arg: "data", type: "object" }
  }

  User.remoteMethod('getAllUser', getAllUser)
  

  //6th API for Detete User
  User.deleteUser = (id, cb) => {
    let query = { _id:id }
    let options = { status:"DELETED" }
    User.update(query, options).then(user=> {
      if(user.count == 0)
        cb(null, "User id not found.")
      else
        cb(null, "You have successfully deleted this user.")
    })
    .catch(err=> cb(err))
  }
  let deleteUser = { 
      http: { path: '/deleteUser', verb: "post" },
      accepts: { arg: 'id', type: "string", http: { source: "query" } },
      returns: { arg: "message", type: "string" }
  }
  User.remoteMethod('deleteUser', deleteUser)


  // 7th API for edit User Profile
  User.editUser = (userData, cb) => {
    let query = { _id:userData.id }
    let options = { name:userData.name }
    User.update(query , options).then(user => {
      if(user.count == 0)
        cb(null, "User id not found.")
      else
        cb(null, "Profile successfully updated.")
    })
    .catch(err=> cb(err))
  }
  let editUser = { 
      http: { path: '/editUser', verb: "post" },
      accepts: { arg: 'data', type: "object", http: { source: "body" } },
      returns: { arg: "message", type: "string" }
  }
  User.remoteMethod('editUser', editUser)


  // 8th API for resetPassword Password
  User.resetPassword = (userData, cb) => {
    let { password, newPassword, email } = userData;
    let query = { where:{ email:email } }
    User.findOne(query).then(result => {
      if (result){
        bcrypt.compare(password, result.password, function(err, res) {
          if(!res)
            cb(null, 'Password not match.')
          else
            bcrypt.genSalt(saltRounds, function(err, salt) {
              bcrypt.hash(newPassword, salt, function(err, hash) {
                let options = { password:hash }
                User.update({ _id:result.id }, options, (err, user) => {
                  if (err)
                    cb(err)
                  else
                    cb(null, "Password successfully change.")
                })
              });
            });
        });
      } 
      else
        cb(null, "Email id not regisetered.")
    })
    .catch(err=> cb(err))
  }
  let resetPassword = { 
      http: { path: '/resetPassword', verb: "post" },
      accepts: { arg: 'data', type: "object", http: { source: "body" } },
      returns: { arg: "message", type: "string" }
  }
  User.remoteMethod('resetPassword', resetPassword)


  // 9th API for Login

  User.login = (userData, cb)=>{
    let { password, email } = userData;
    let query = { where:{ email:email } }
    User.findOne(query)
    .then(user=>{
      if(user){
        if(user.status != "ACTIVE"){
          let query1 = { _id:user.id }
          let OTP = Math.floor( 100000 + Math.random() * 900000)
          let options = { OTP:OTP }
          User.update(query1, options)
          .then(update=> cb(null, "An OTP sent on your email id."))
          .catch(err=> cb(err))
        } 
        else{
          bcrypt.compare(password, user.password, function(err, res) {
            if(res)
              cb(null, 'You have successfully login.')
            else
              cb(null, 'Invalid credentials.')
          });
        }
      }
      else
        cb(null, 'Invalid credentials.')
    })
    .catch(err=> cb(err))
  }

  let login = {
    http:{ path:'/login', verb:'post' },
    accepts:{ arg:'data', type:'object', http:{ source:'body' } },
    returns:{ arg:'data', type:"string" }
  }

  User.remoteMethod('login', login)



}
