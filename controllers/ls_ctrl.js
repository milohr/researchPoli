"use strict";

const userModel = require('../models/user');
const service = require('../services');

const SALT_WORK_FACTOR = 10;

class Auth
{
    
    signIn(req, res)
    {        
        const User = new userModel.UserActions();
        User.passUser(req.body,(ok,data)=>
        {
            if(ok)
            {
                User.getUser({email: req.body.email},(okay, msg)=>
                {
                    if(okay)
                    {
                        req.user = msg;
                        let token = service.createToken(msg);                
                        req.session.usrToken = token;
                        req.session.user = msg;
                        req.session.save((err)=>
                        {
                            if(!err) return res.redirect('/dashboard');
                            
                            return res.status(200).render('login', {error:"Couldn't login"});
                                         
                        });
                    }else return res.render('login', {error:"Couldn't login"}); 
                }); 
            }else return  res.render('login',data); 
            
        });
        
    }
    
    login(req, res)
    {
        res.render('login',{title: 'Login'});
    }
    
    logout(req, res)
    {
        req.session.destroy((err)=>
        {
            if(err) return res.status(500).send({message:"couln't logout"});            
            return res.redirect('/');                                
        });
    }
  
}
//                 res.cookie("usrToken" , token,{maxAge : 9999}).redirect('/logged'); 
//                 res.redirect(`/logged/?token=${token}`);     
module.exports = Auth;
