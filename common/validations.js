const CONSTANT = require('./constant')
module.exports = {

    LOGIN:(userData, cb)=>{
        if(userData.email == undefined || userData.email == '')
            cb( CONSTANT.EMAIL_BLANK_ERROR, null)
        else if(userData.password == undefined || userData.password == '')
            cb( CONSTANT.PASSWORD_BLANK_ERROR, null)
        else
            cb(null, "OK")
    },

    SEND_OTP:(email, cb)=>{
        if(email == undefined || email == '')
            cb( CONSTANT.EMAIL_BLANK_ERROR, null )
        else
            cb(null, "OK")
    },

    VERIFY_OTP:(userData, cb)=>{
        if(userData.email == undefined || userData.email == '')
            cb(CONSTANT.EMAIL_BLANK_ERROR, null)
        else if(userData.OTP == undefined || userData.OTP == '')
            cb( CONSTANT.OTP_BLANK_ERROR, null)
        else
            cb(null, "OK")
    },


    GET_OR_DELETE_USER:(id, cb)=>{

        if(id == undefined || id == '')
            cb(  CONSTANT.ID_BLANK_ERROR, null )
        else
            cb(null, "OK")
    },

    EDIT_USER:(userData, cb)=>{

        if(userData.id == undefined || userData.id == '')
            cb(CONSTANT.ID_BLANK_ERROR, null)
        else
            cb(null, "OK")
    },

    RESET_PASSWORD:(userData, cb)=>{

        if(userData.email == undefined || userData.email == '')
            cb(CONSTANT.EMAIL_BLANK_ERROR, null)
        else if(userData.password == undefined || userData.password == '')
            cb( CONSTANT.PASSWORD_BLANK_ERROR, null)
        else if(userData.newPassword == undefined || userData.newPassword == '')
            cb( CONSTANT.PASSWORD_BLANK_ERROR, null)
        else
            cb(null, "OK")
    }

}