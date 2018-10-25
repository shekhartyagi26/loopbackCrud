const bcrypt = require('bcrypt')
const CONSANT = require('./constant');

module.exports = {
    
    createHash:(password, cb)=>{
        bcrypt.genSalt(CONSANT.SALT_ROUNDS, (err, salt)=>{
            bcrypt.hash(password, salt, (err, hash)=>{
                if(err)
                    cb(err)
                else
                    cb(null, hash)
            });
        });
    },

    hashCompare:(oldPassword, dbPassword, cb)=>{
        bcrypt.compare(oldPassword, dbPassword, (err, match)=>{
            if(err)
                cb(err)
            else
                cb(null, match)
        })
    }
}