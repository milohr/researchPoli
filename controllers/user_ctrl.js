"use strict";

const userModel = require('../models/user');
const publicationModel = require('../models/publication');

const User = new userModel.UserActions();
const userSchema= userModel.user;

class UserCtrl
{
    userDashboard(req,res)
    {
        if(req.session.user)
        {
            if(req.session.user.role==="ADMIN")
                return res.render('users',{user: req.session.user});
            else  return res.render('dashboard',{error:"You need to be an ADMIN",user: req.session.user});
                
        }else return res.render('login',{error: "Need to login"});
    }    
    
    registerUser(req, res)
    {
        if(req.session.user)
        {
           if(req.session.user.role === 'ADMIN')
           {
                if(req.body.password === req.body.password_check)
                {
                    const newUser = new userSchema(
                    {
                        email: req.body.email,
                        id: req.body.id,
                        name: req.body.name,
                        last_name: req.body.last_name,
                        second_last_name: req.body.second_last_name,
                        password: req.body.password,
                        role: req.body.role,
                        description: req.body.description,
                        photo: req.body.photo || null
                    });
                    
                    console.log(newUser);
                    User.saveUser(newUser,(ok,msgUser)=>
                    {
                        if(ok) return res.status(200).render('users',{message:msgUser.message,user:req.session.user});
                                 
                        return res.status(500).render('users',{msgUser,user:req.session.user});                        
                    });
                    
                }else return res.render('users',{error:"Passwords didn't match",user:req.session.user} );                
           }else return res.render('login',{error:"You need to be an ADMMIN"});
        }else return res.render('login',{error:"You need to login"});
    }

    
    updateUser(req,res)
    {
        if(req.session.user)
        {
            if(req.body.password === req.body.password_check)
            {
                let updatedUser=
                {                   
                    id: req.body.id,
                    name: req.body.name,
                    last_name: req.body.last_name,
                    second_last_name: req.body.second_last_name, 
                    description:req.body.description,
                    photo: req.body.photo
                }; 
                
                if(req.body.password)
                    updatedUser.password= req.body.password;
                if(req.body.role)
                    updatedUser.role= req.body.role;       
                
                console.log(updatedUser);
               User.findOneAndUpdate({email:req.body.email},updatedUser,{new: true,multi: true,runValidators: true,context: 'query'},(err, updated)=>
                {
                    if(err) return res.render('users',{error:'Could not update user',user:req.session.user,update_user:req.body});
                                     
                    console.log(updatedUser);               
                    return res.render('users',{message:`User updated: ${updated.email}`,user:req.session.user});                     
                });
                
            }else return res.render('users',{error:"Passwords didn't match",user:req.session.user}, );
        }else return res.render('login',{error:"You need to login"});
    }
    
    userAction(req,res)
    {
        if(req.session.user)
        {
            if(req.body.id)
            {
                var action = req.body.action;
                
                if(action==="UPDATE")
                {               
                    User.getUser({$or: [{id:req.body.id},{email:req.body.id}]},(ok,msgUser)=>
                    {                        
                        if (ok) return res.render('users',{update_user:msgUser,user:req.session.user});
                        
                        return res.render('users',{error:msgUser.error});
                        
                    });
                    
                }else if(action==="REMOVE")
                {
                    User.remove({id:req.body.id},(err,cant)=>
                    {
                        if(err) return res.render('users',{error:err});
                        if(cant==0) return res.render('users',{error:"Coulnd't remove user"});
                        return res.render('users',{message:`User removed ${req.body.id}`,user:req.session.user});
                    });
                }
            }else return res.render('users',{error: "You need to provide an ID"});
        }else return res.render('login',{error: "Need to login"});
    }
}


module.exports = UserCtrl;
