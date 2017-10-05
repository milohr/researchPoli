"use strict";

const mongoose = require('./db');
const schema = mongoose.Schema;

const publicationSchema = new schema(
{
    title: {type: String, required:true},
    subtitle: String,
    doi: {type: String, unique: true},
    authorsIds: [{type: String, required:true}], 
    credits: [String],
    date:{type: String, required:true},
    registerDate:{ type: Date, default: Date.now() },
    tags:[String],
    type: {type:String, enum: ['THESIS','PUBLICATION','ESSAY','PROJECT','COMMON'], default: "COMMON"},
    area: {type: String, enum:['INFORMATICS']},
    description: String,
    file: String

}, {collection: "Publications"});

const publication = mongoose.model('Publications',publicationSchema);

class PublicationActions
{
    
    savePublication(newPublication, cb)
    {
        newPublication.save((err)=>
        {
            if(err) return cb(false, {error:err});
            return cb(true, {messagge: "Publication saved"});
        });        
    }
    
    updatePublication(updatedPublication, cb)
    {
        publication.findOneAndUpdate({_id:updatedPublication._id},updatedPublication,{new: true,multi: true,runValidators: true,context: 'query'},(err, updated)=>
        {
            if(err) return cb(false,{error:'Could not update publication'});
            if(!updated) return cb(false, {error:"No publication was updated"})
            return cb(true,updated)                    
        });
    }
    
    removePublication(publication,cb)
    {        
        publication.remove(query,(err,cant)=>
        {
            if(err) return cb(false,{error:err});
            if(cant==0) return cb(false,{error:"Couldn't remove publication 0"});
            return cb(true,{message:"Publication correctly removed"});
        });         
    }
    
    getPublication(query,cb)
    {
        publication.findOne(query,(err,publication)=>
        {
            if(err) return cb(false,{error: err});
            if(!publication)  return cb(false,{error: "Publication doens't exists"});            
            
            return cb(true,publication); 
        }); 
    }
    
    getPublications(query,cb)
    {
        publication.find(query).sort({registerDate: 'desc'}).exec((err, publications)=>
        {
            if(err) return cb(false,{error: err});
            if(!publications)  return cb(false,{error: "Dind't find any publications match"});            
            
            return cb(true,publications); 
        }); 
    }
    
    getPublicationsUsers(query,cb)
    {
        publication.aggregate([{$match: query},{$lookup: { from: "Users", localField: "authorsIds", foreignField: "id", as: "user_docs" } }],(err, publications) =>
        {
            if(err) return cb(false,{error: err});
            if(!publications)  return cb(false,{error: "Dind't find any publications match"});            
            
            return cb(true,publications); 
        }); 

    }
}
   

module.exports = {PublicationActions, publication};
