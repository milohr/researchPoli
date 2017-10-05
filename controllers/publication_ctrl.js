"use strict";

const userModel = require('../models/user');
const publicationModel = require('../models/publication');

const userSchema =userModel.user;
const User = new userModel.UserActions();

const publicationSchema = publicationModel.publication;
const Publication = new publicationModel.PublicationActions();


class PublicationCtrl
{
    publicationDashboard(req,res)
    {
        if(req.session.user) return res.render('publications',{user:req.session.user});
        return res.render('login',{error:"You need to login"});
    }
    
    registerPublication(req,res)
    {
        if(req.session.user)
        {                       
            let newPublication = new publicationSchema(
            {
                title: req.body.title,
                subtitle: req.body.subtitle || "",
                authorsIds: (req.body.authorsIds).split(",") || [req.session.user.id],
                credits: (req.body.credits).split(","),
                doi: req.body.doi,
                date: req.body.date,
                description: req.body.description,
                file: req.body.file,
                tags: req.body.tags? (req.body.tags).split(',') : [],
                type: req.body.type                
            });
            
            Publication.savePublication(newPublication,(ok,msgPublication)=>
            {
                if(ok) return res.render('publications',{message:msgPublication.message,user:req.session.user}); 
                return res.render('publications',{error:msgPublication.error,user:req.session.user});                
            });
            
        }else return res.render('login',{error:"You need to login"});
    }
    
    publicationAction(req,res)
    {
        if(req.session.user)
        { 
            let query= req.body.query;
            
            Publication.getPublications({ $or: [ {title: {'$regex': query, '$options': 'i'}}, {authorsIds:  {'$regex': query, '$options': 'i'}},{description: {'$regex': query, '$options': 'i'}} ]},(ok,msgPublication)=>
            {                
                if(ok) return res.render('publications',{publication_list:msgPublication,user:req.session.user}); 
                 return res.render('publications',{msgPublication,user:req.session.user});
            });           
                   
        }else return res.render('login',{error:"You need to login"});
    }    
    
    updatePublication(req,res)
    {
        if(req.session.user)
        {   
            let updatedPublication = 
            {
                _id: req.body._id,
                title: req.body.title,
                subtitle: req.body.subtitle || "",
                authorsIds: (req.body.authorsIds).split(","),
                credits: (req.body.credits).split(","),
                doi: req.body.doi,
                date: req.body.date,
                description: req.body.description,
                $addToSet: { tags: { $each: req.body.tags.split(',') } }, 
                file: req.body.file
            };
            if(req.body.type)
                updatedPublication.type= req.body.type; 
            
            Publication.updatePublication(updatedPublication,(ok,msgPublication)=>
            {                
                if(ok) res.render('publications',{msgPublication,user:req.session.user}); 
                return res.render('publications',{msgPublication,user:req.session.user,update_publication:updatedPublication});
                   
            });   
           
        }else return res.render('login',{error:"You need to login"});
    }
    
     
    removePublication(req,res)
    {
        if(req.session.user)
        {
            Publication.removePublication({_id:req.body._id},(ok,msgPublication)=>
            {                
                return res.render('publications',{msgPublication,user:req.session.user});
            });            
        }else return res.render('login',{error:"You need to login"});        
    }
    
    getPublication(req,res)
    {
        if(req.session.user)
        {
            if(req.query._id)
            {            
                Publication.getPublication({_id:req.query._id},(ok,msgPublication)=>
                {
                    if(ok)
                    {
                        if((msgPublication.authorsIds).includes(req.session.user.id)||req.session.user.role==="ADMIN")
                            return res.render('publications',{update_publication:msgPublication,user:req.session.user});  
                        else return res.render('publications',{error:"You don't have permission to edit this publication",user:req.session.user});                  
                        
                    }else res.render('publications',{msgPublication, user:req.session.user});                   
                                         
                });
                
            } else return res.render('publications',{error:"Need an ID to search for publications", user:req.session.user});
            
        }else return res.render('login',{error:"You need to login"});
        
    }
    
    showPublications(req,res)
    {
        Publication.getPublicationsUsers({},(ok,msgPublications)=>
        {
            if(ok) return res.status(200).render('publications',{color:"#fffc96",publication_list_open:msgPublications, user:req.session.user}) ;

            return res.status(404).render('publications',{user:req.session.user}) ; 
        });
        
    }
}


module.exports = PublicationCtrl;
