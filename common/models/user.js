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


}
