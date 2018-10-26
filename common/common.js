const bcrypt = require('bcrypt')
const constant = require('./constant');
let router = {
    http:{  },
    accepts:{  },
    returns:{ arg:"data", type:"object" }
}

module.exports = {
    
    createHash:(password, cb)=>{
        bcrypt.genSalt(constant.SALT_ROUNDS, (err, salt)=>{
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
    },

    validation:(object)=>{
        for(var key in object)
            if(!object[key])
                return `${key} can't be blank.`;
    },

    router:(path, verb, arg)=>{
        router.http = { path:path, verb:verb };
        if(verb == 'get')
            router['accepts'] = { arg:arg, type:'string', http:{ source:'query' } }
        else
            router['accepts'] = { arg:'data', type:'object', http:{ source:'body' } }
        return router;    
    }
}