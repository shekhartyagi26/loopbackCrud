const common = require('../common');
const constant = require('../constant');

const signup = (User, userData, cb)=>{
    User.create(userData, (err, user)=>{
        if(err)
          cb(err);
        else
          cb(null, user);
    });
};

const sendOTP = (User, email, cb)=>{
    let options = { OTP: constant.OTP };
    let query = { where: { "email": email } };
    User.findOne(query).then(user=> {
      if (user) {
        User.update({ _id:user.id } , options, (err, user) => {
          if (err)
            cb(err);
          else
            cb(null, constant.SEND_OTP);
        });
      } 
      else
        cb(constant.EMAIL_ID_NOT_FOUND, null);
    })
    .catch(err=> cb(err));
};

const verifyOTP = (User, userData, cb)=>{
    let { email, OTP } = userData;
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
};

const getUser = (User, id, cb)=>{
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
};


const getAllUser = (User, cb)=>{
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
};

const deleteUser = (User, id, cb)=>{
    let query = { _id:id }
    let options = { status:"DELETED" }
    User.update(query, options).then(user=> {
      if(user.count == 0)
        cb(constant.USER_ID_NOT_FOUND, null)
      else
        cb(null, constant.DELETE_USER)
    })
    .catch(err=> cb(err))
};

const editUser = (User, userData, cb)=>{
    let query = { _id:userData.id }
    let options = { name:userData.name }
    User.update(query , options).then(user => {
      if(user.count == 0)
        cb(constant.USER_ID_NOT_FOUND)
      else
        cb(null, constant.PROFILE_UPDATE)
    })
    .catch(err=> cb(err))
};

const resetPassword = (User, userData, cb)=>{
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
};

const login = (User, userData, cb)=>{
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
};

module.exports = {

    signup,
    sendOTP,
    verifyOTP,
    getUser,
    getAllUser,
    deleteUser,
    editUser,
    resetPassword,
    login

}