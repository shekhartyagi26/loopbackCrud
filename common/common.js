const bcrypt = require('bcrypt'),
      constant = require('./constant'),
      common = require('./common')
let route = {
    http:{  },
    accepts:{  },
    returns:{ arg:"data", type:"object" }
}, err, reqParameter, body = { };

const createHash = (password, cb)=>{
    bcrypt.genSalt(constant.SALT_ROUNDS, (err, salt)=>{
        bcrypt.hash(password, salt, (err, hash)=>{
            if(err)
                cb(err)
            else
                cb(null, hash)
        });
    });
}

const hashCompare = (oldPassword, dbPassword, cb)=>{
    bcrypt.compare(oldPassword, dbPassword, (err, match)=>{
        if(err)
            cb(err)
        else
            cb(null, match)
    })
}

const validation = (object)=>{
    for(var key in object)
        if(!object[key])
            return `${key} can't be blank.`;
}

const router = (path, verb, arg)=>{
    route.http = { path:path, verb:verb };
    if(verb == 'get')
        route['accepts'] = { arg:arg, type:'string', http:{ source:'query' } }
    else
        route['accepts'] = { arg:'data', type:'object', http:{ source:'body' } }
    return route;    
}

const beforeRemote = (context, parameter, next)=>{

    if(context.method.http['verb'] == 'post')
        reqParameter = context.req.body;
    else
        reqParameter = context.req.query;
    parameter.map((x)=>{
        body[x] = reqParameter[x]   
    })
    err = validation(body)
    if(err)
        next(err);
    else
        next();
}

module.exports = {

    createHash,
    hashCompare,
    validation,
    router,
    beforeRemote
}