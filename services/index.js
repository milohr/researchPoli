"use strict";

const jwt = require('jwt-simple');
const moment = require('moment');
const conf = require('../conf');

function createToken(user)
{
    console.log("USER>>",user);
    const payload = 
    {
        sub: user._id, //get the new user id
        iat:moment().unix(), //get the creation time of the user
        exp: moment().add(14,'days').unix() //set expiration time to 14 days
    }    
    return jwt.encode(payload, conf.auth.SECRET_TOKEN); //encode using a token
}

function decodeToken(token)
{
    const decoded = new Promise((resolve, reject) =>
    {
            console.log("<<STARt >"+token);

        try
        {
             console.log("<<TRYING >"+token);
           const payload = jwt.decode(token, conf.auth.SECRET_TOKEN);
           
            console.log("<<PAYLOAD >"+token);
           
           if(payload.exp <= moment().unix())
            {
                console.log("<<REJECT >>");
                reject({status: 401, message: "Token has expired"});
            }else{
                 console.log("<<RESOLVE >>");
                resolve(payload.sub);
            }            
            
        }catch(err)
        {
            reject({status: 500, message: "Invalid Token"});
        }
    });
    
    return decoded;
}

module.exports = {createToken, decodeToken};
