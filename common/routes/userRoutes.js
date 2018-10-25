module.exports = {
    
    SIGNUP:{

        http:{ path:'/signup', verb:"post" },
        accepts:{ arg:'data', type:"object", http:{ source:"body" } },
        returns:{ arg:"data", type:"object" } 
    },

    LOGIN:{

        http:{ path:'/login', verb:'post' },
        accepts:{ arg:'data', type:'object', http:{ source:'body' } },
        returns:{ arg:'data', type:"string" }
    },

    SEND_OTP:{

        http: { path: '/sendOTP', verb: "post" },
        accepts: { arg: 'email', type: "string", http: { source: "query" } },
        returns: { arg: "message", type: "string" }
    },

    VERIFY_OTP:{
         
        http: { path: '/verifyOTP', verb: "post" },
        accepts: { arg: 'data', type: "object", http: { source: "body" } },
        returns: { arg: "message", type: "string" }
    },

    GET_USER:{

        http: { path: '/getUser', verb: "get" },
        accepts: { arg: 'id', type: "string", http: { source: "query" } },
        returns: { arg: "data", type: "object" }
    },

    GET_ALL_USER:{

        http: { path: '/getAllUser', verb: "get" },
        accepts: { arg: 'filter', type: "string", http: { source: "query" } },
        returns: { arg: "data", type: "object" }
    },

    DELETE_USER:{

        http: { path: '/deleteUser', verb: "post" },
        accepts: { arg: 'id', type: "string", http: { source: "query" } },
        returns: { arg: "message", type: "string" }
    },

    EDIT_USER:{

        http: { path: '/editUser', verb: "post" },
        accepts: { arg: 'data', type: "object", http: { source: "body" } },
        returns: { arg: "message", type: "string" }
    },

    RESET_PASSWORD:{

        http: { path: '/resetPassword', verb: "post" },
        accepts: { arg: 'data', type: "object", http: { source: "body" } },
        returns: { arg: "message", type: "string" }
    },

    
}