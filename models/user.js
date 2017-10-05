"use strict";

const mongoose = require('./db');
const schema = mongoose.Schema;
const encrypt = require('bcrypt-nodejs');
const ENCRYPT_SALT=10;

const userSchema = new schema(
{
    email: {type: String, unique: true, lowercase: true, required:true},
    id: {type: String, unique: true, lowercase: true, required:true},
    name: {type: String, lowercase: true, required:true},
    last_name: {type: String, lowercase: true, required:true},
    second_last_name: {type: String, lowercase: true, required:true},
    password: {type: String, select:false},
    avatar: String,
    singupDate:{ type: Date, default: Date.now() },
    lastLogin: Date,
    role: {type:String, enum: ['ADMIN', 'TEACHER', 'STUDENT', 'COMMON'], required:true},
    description: String,
    photo: {type: String, default: "https://au.junkfreejune.org/themes/base/production/images/default-profile.png"}

}, {collection: "Users"});


userSchema.methods.pass = function(pass,cb)
{
    console.log(pass, this.password);
     encrypt.compare(pass, this.password, function(err, isMatch) {
        if (err) return cb(false,{error:"Password is incorrect"});
        cb(isMatch,{match: isMatch});
    });
}

var hashPasswordSave= function(next) {
    console.log("I'm on the prev save function");
    var user = this;    
    if (!this.isModified('password')) return next();    
    encrypt.genSalt(ENCRYPT_SALT, (err,salt) =>
    {
        if(err) return next(err);
                    
        encrypt.hash(user.password,salt,null,(err,hash)=>
        {
            if(err) return next(err);
            console.log("PASSWORD HASH FOR:",user.email,user.password);            
            user.password = hash;
            console.log("PASSWORD HASH FOR:",user.email,user.password);
            console.log(hash);
            return next();
        });
    });
};

var hashPasswordUpdate= function(next) {
    console.log("I'm on the prev save function");
    var user = this.getUpdate();    
    if (!user.password) return next();    
    encrypt.genSalt(ENCRYPT_SALT, (err,salt) =>
    {
        if(err) return next(err);
                    
        encrypt.hash(user.password,salt,null,(err,hash)=>
        {
            if(err) return next(err);
            console.log("PASSWORD HASH FOR:",user.email,user.password);            
            user.password = hash;
            console.log("PASSWORD HASH FOR:",user.email,user.password);
            console.log(hash);
            return next();
        });
    });
};


userSchema.pre('save', hashPasswordSave);
userSchema.pre('findOneAndUpdate', hashPasswordUpdate);

const user = mongoose.model('User',userSchema);

class UserActions
{
    
    saveUser(newUser,cb)
    {
        newUser.save((err)=>
        {
            if(err) return cb(false,{error:err});
            return cb(true,{message:"User saved correctly"});
        });       
    }
    
    
    getUsers(query,cb) //cb callback
    {
        user.find(query, (err,users)=>
        {
            if(err) return cb(false,{error: err});
            if(!users) return cb(false,{error: "Dind't find any user match"});
            cb(true,users);
        });
    }
    
    getUser(query,cb) //cb callback
    {
       user.findOne(query, (err, user)=>
        {
            if(err) return cb(false,{error: err});
            if(!user) return cb(false,{error: "User doesn't exists"});
            return cb(true,user);
        });
    } 
    
    passUser(data,cb)
    {
        user.findOne({email: data.email},{password:1,role:1},(err,user)=>
        {
            
            if(err) return cb(false,{error: err});
            if(!user)  return cb(false,{error: "User doesn't exists"});
                     
           user.pass(data.password,(ok,message)=>
           {               
            if(ok && (user.role == "ADMIN" || user.role == "TEACHER")) return cb(true,data);
            else if(ok && user.role != "ADMIN" ) return cb(false, {error:"You need to be admin"});
                                
            return cb(false, {error:"Password is incorrect"});               
            });        
            
        });
    }
}


module.exports = {UserActions, user};
