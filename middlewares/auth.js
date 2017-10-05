"use strict";

const services = require('../services');

function isAuth( req, res, next)
{
    
//     console.log("isAUth COOKIES>>",req.cookies);
    console.log("isAUth USER>>",req.session.user);
    var token;
    if(req.session.usrToken)
    {
        token = req.session.usrToken;
        
    }else if(req.headers.authorization)
    {
       token = req.headers.authorization.split(" ")[0];
      
    }else{
        return res.render('login',{error: "You need to Login first"}); 
    }
    
    
    console.log("isAuth TOKE: >>"+token);
    
    services.decodeToken(token)
    .then(response =>
    {
        console.log(response);
        req.user = response;
        next();
    })
    .catch(response => 
    {
        console.log(response);
        res.status(response.status).send(response.message);
    })
}

module.exports = isAuth;
