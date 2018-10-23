'use strict';
// PersistedModel

module.exports = (User) => {


  // 1st API for Login User

  User.login = (userData, cb) => {
    let { email, password } = userData;
    let query = { where: { "email": email } }
    User.findOne(query)
      .then(user => {
        if (user){
          let { status, id } = user;
          if (status == "ACTIVE"){
              if(password == user.password)
                cb(null, "You have successfully login.")
              else
                cb(null, "You have entered invalid password.")          
          } 
          else {
            let OTP = Math.floor(100000 + Math.random() * 900000)
            User.update({ _id:id }, { OTP:OTP }, (err, user) => {
              if (err)
                cb(err)
              else
                cb(null, "An OTP hase been sent on you registered email address.")
            })
          }
        } 
        else {
          cb(null, "Email id not registered.")
        }
      })
      .catch(err => cb(err))
    }
    let login = { 
      http: { path: '/login', verb: "post" },
      accepts: { arg: 'data', type: "object", http: { source: "body" } },
      returns: { arg:"message", type:"string" }
    }

  User.remoteMethod('login', login)





  // 2nd API for Singup User 
  User.signup = (userData, cb) => {
    
    new User(userData).save((err, result) => {
      if (err)
        cb(err)
      else
        cb(null, result)
    })
  }
  let signup = { 
      http: { path: '/signup', verb: "post" },
      accepts: { arg: 'data', type: "object", http: { source: "body" } },
      returns: [
        { arg: 'emal', type: "string" }, 
        { arg: 'name', type: "string" },
        { arg: 'id',   type: 'string' }
      ]
  }
  User.remoteMethod('signup', signup)



  //3rd API for send OTP
  User.sendOTP = (email, cb) => {

    let OTP = Math.floor(100000 + Math.random() * 900000)
    let options = { OTP: OTP }
    let query = { where: { "email": email } }
    User.findOne(query, (err, result) => {
      if (err)
        cb(err)
      else if (result) {
        User.update({ _id:result.id } , options, (err, user) => {
          if (err)
            cb(err)
          else
            cb(null, "An OTP hase been sent on you registered email address.")
        })
      } else
        cb(null, "Invalid user id.")
    })
  }
  let sendOTP = { 
      http: { path: '/sendOTP', verb: "post" },
      accepts: { arg: 'email', type: "string", http: { source: "query" } },
      returns: { arg: "message", type: "string" }
  }
  User.remoteMethod('sendOTP', sendOTP)



  // 4th API for Verify OTP
  User.verifyOTP = (data, cb) => {
    let { email, OTP } = data
    let query = { where: { "email": email } }
    let options = { status: "ACTIVE" }
    User.findOne(query, (err, result) => {
      if (err)
        cb(err)
      else if (result) {
        if (result.OTP == data.OTP) {
          User.update({_id:result.id}, options, (err, user) => {
            if (err)
              cb(err)
            else
              cb(null, "You have successfully login.")
          })
        } else
          cb(null, "Invalid OTP.")
      } else
        cb(null, "Email id not regisetered.")
    })
  }
  let verifyOTP = { 
    http: { path: '/verifyOTP', verb: "post" },
    accepts: { arg: 'data', type: "object", http: { source: "body" } },
    returns: { arg: "message", type: "string" }
  }
  User.remoteMethod('verifyOTP', verifyOTP)


  // 5th API for User Detail

  User.getUser = function(id, cb){
    let query = {  
      where:{ _id:id },
      fields: { id: true, email: true, name: true } 
    }
    User.findOne(query, (err, result) => {
      if (err)
        cb(err)
      else if (result)
        cb(null, result) 
      else
        cb(null, { message:"Invalid user id." })
    })
  }

  let getUser = { 
    http: { path: '/getUser', verb: "get" },
    accepts: { arg: 'id', type: "string", http: { source: "query" } },
    returns: { arg: "data", type: "object" }
  }

  User.remoteMethod('getUser', getUser)


  // 6th API for get ALl User list

  User.getAllUser = function(id, cb){
    let query = {  
      where:{ status:"ACTIVE" },
      fields: { id: true, email: true, name: true } 
    }
    User.find(query,  (err, result) => {
      if (err)
        cb(err)
      else if (result)
        cb(null, result) 
      else
        cb(null, { message:"Invalid user id." })
    })
  }

  let getAllUser = { 
    http: { path: '/getAllUser', verb: "get" },
    accepts: { arg: 'filter', type: "string", http: { source: "query" } },
    returns: { arg: "data", type: "object" }
  }

  User.remoteMethod('getAllUser', getAllUser)
  

  //7th API for Detete User
  User.deleteUser = (id, cb) => {
    let query = { _id:id }
    let options = { status:"DELETED" }
    User.update(query , options, (err, user) => {
      if (err)
        cb(err)
      else if(user.count == 0)
        cb(null, "User id not found.")
      else
        cb(null, "You have successfully deleted this user.")
    })
  }
  let deleteUser = { 
      http: { path: '/deleteUser', verb: "post" },
      accepts: { arg: 'id', type: "string", http: { source: "query" } },
      returns: { arg: "message", type: "string" }
  }
  User.remoteMethod('deleteUser', deleteUser)


  // 8th API for edit User Profile
  User.editUser = (userData, cb) => {
    let query = { _id:userData.id }
    let options = { name:userData.name }
    User.update(query , options, (err, user) => {
      if (err)
        cb(err)
      else if(user.count == 0)
        cb(null, "User id not found.")
      else
        cb(null, "Profile successfully updated.")
    })
  }
  let editUser = { 
      http: { path: '/editUser', verb: "post" },
      accepts: { arg: 'data', type: "object", http: { source: "body" } },
      returns: { arg: "message", type: "string" }
  }
  User.remoteMethod('editUser', editUser)



  // 9th API for resetPassword Password
  User.resetPassword = (userData, cb) => {
    let { password, newPassword, email } = userData
    let query = { where:{ email:email } }
    let options = { password:newPassword }
    User.findOne(query, (err, result) => {
      if (err)
        cb(err)
      else if (result) {
        if (result.password == password) {
          User.update({_id:result.id}, options, (err, user) => {
            if (err)
              cb(err)
            else
              cb(null, "Password successfully change.")
          })
        }
        else
          cb(null, "Password not match.")
      } 
      else
        cb(null, "Email id not regisetered.")
    })
  }
  let resetPassword = { 
      http: { path: '/resetPassword', verb: "post" },
      accepts: { arg: 'data', type: "object", http: { source: "body" } },
      returns: { arg: "message", type: "string" }
  }
  User.remoteMethod('resetPassword', resetPassword)



}
