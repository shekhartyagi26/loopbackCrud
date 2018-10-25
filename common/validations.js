const CONSTANT = require('./constant')
module.exports = {

    LOGIN:(userData, cb)=>{
        if(userData.email == undefined || userData.email == '')
            cb( { message:'Email'+" "+ CONSTANT.BLANK })
        else if(userData.password == undefined || userData.password == '')
            cb( { message:'Password'+" "+ CONSTANT.BLANK })
        else
            cb(null, "OK")
    },

    SEND_OTP:(email, cb)=>{
        if(email == undefined || email == '')
            cb( { message:'Email'+" "+ CONSTANT.BLANK })
        else
            cb(null, "OK")
    },

    VERIFY_OTP:(userData, cb)=>{
        if(userData.email == undefined || userData.email == '')
            cb({ message:'Email'+" "+ CONSTANT.BLANK })
        else if(userData.OTP == undefined || userData.OTP == '')
            cb( { message:'OTP'+" "+ CONSTANT.BLANK })
        else
            cb(null, "OK")
    },


    GET_OR_DELETE_USER:(id, cb)=>{

        if(id == undefined || id == '')
            cb( { message:'ID'+" "+ CONSTANT.BLANK })
        else
            cb(null, "OK")
    },

    EDIT_USER:(userData, cb)=>{

        if(userData.id == undefined || userData.id == '')
            cb( { message:'ID'+" "+ CONSTANT.BLANK })
        else
            cb(null, "OK")
    },

    RESET_PASSWORD:(userData, cb)=>{

        if(userData.email == undefined || userData.email == '')
            cb( { message:'Email'+" "+ CONSTANT.BLANK })
        else if(userData.password == undefined || userData.password == '')
            cb( { message:'Password'+" "+ CONSTANT.BLANK })
        else if(userData.newPassword == undefined || userData.newPassword == '')
            cb( { message:'newPassword'+" "+ CONSTANT.BLANK })
        else
            cb(null, "OK")
    }

}