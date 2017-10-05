"use strict";

const UserActions = require('../models/user').UserActions;
const PublicationActions = require('../models/publication').PublicationActions;

const lsCtrl = require('./ls_ctrl');
const UserCtrl = require('./user_ctrl');
const PublicationCtrl = require('./publication_ctrl');
const GroupCtrl = require('./group_ctrl');

const Publication = new PublicationActions();
const User = new UserActions();

class Paths
{
    index(req,res)
    {        
        let news=[{header:"GRUPOS PARES\nInternos:\nGHYGAM: Grupo de Investigacion en Higiene y Getión AmbientalISAII.\nExternos:\nGIDIA: Grupo de Investigación de I+D en Inteligencia Artificial - UNALMED.\nGrupo de Investigación en Tecnologías de Información – UNAB."}];
        let projects=[
                    'Simulación 3D del Politecnico JIC con Realidad Virtual y orientada a la Web',
                    'Modelo para la Búsqueda y Recuperación Semántica en Bibliotecas Digitales',
                    'Modelamiento de  un sistema de información geográfico que permita medir el  impacto  del programa en ciclo propedéutico: tecnica profesional en programación en sistemas de información y tecnología en sistematización de datos de la Facultad de Ingenieria del Politecnico Colombiano Jaime Isaza Cadavid',
                    'Sistema Integrado de Informática Agropecuaria “SIIA”',
                    'Diseño de una arquitectura Web para el manejo académico de estudiantes “MACADE”'];
                    
        Publication.getPublicationsUsers({},(ok, msgPublications)=>
        { 
            if(ok) return res.render('home',{color:"#262026",project_list:projects,news_list:news,publication_list:msgPublications,user:req.session.user});            
            return res.render('home',{color:"#262026",project_list:projects,news_list:news,error:msgPublications.error,user:req.session.user});  
        });        
    }
    
    dashboard(req,res)
    {
        res.set({
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma' : 'no-cache',
                'Expires' : '0',
            }); 
              
        if(req.session.user)        
            return res.render('dashboard',{color:"#6c8672",user: req.session.user});
        
        return res.render('login',{error: "Coulnd't log"});
    }    
    
    showPeople(req,res)
    {   
        if(req.query.userEmail || req.query.userId)
        {
            const query = req.query.userEmail? {email: req.query.userEmail} : {id: req.query.userId};
            
            User.getUser( query ,(ok,msgUser)=>
            {   
                if(ok)
                {                    
                    Publication.getPublications({authorsIds:msgUser.id},(ok,msgPublications)=>
                    {                        
                        if(ok) return res.render('people',{color:"#fffc96",person:msgUser,publications:msgPublications,user:req.session.user}); 
                        else  return res.render('people',{person:msgUser,message:msgPublications,user:req.session.user});                        
                    });
                }else return res.render('people',{error: "Couldn't find person",user:req.session.user});
                               
            }); 
            
        }else
        {
            User.getUsers( { $or: [ {role: "TEACHER"}, {role: "STUDENT"} ] },(ok,msgUsers)=>
            {    
                if(ok) return res.render('people',{color:"#9ca1a4",people:msgUsers,user:req.session.user});
                return res.render('people',{error:msgUsers,user:req.session.user}); 
            });  
        } 
    }
    
    showInvestigations(req,res)
    {
        let investigation=
        {
            
            title: "INVESTIGACIÓN",
            description: "Contribuir en la investigación del desarrollo de software, mediante el estudio y tratamiento de herramientas de software propietarias y libres en el ámbito académico, científico y empresarial, que den solución a diferentes problemáticas de la institución, la industria o el medio en general.",
            items: 
            [ 
                {
                    title:"LÍNEAS DE INVESTIGACIÓN",
                    subitems: [
                    "Línea de Investigación en Desarrollo de Software (LIDS)",
                    "Línea de Investigación en Inteligencia Computacional (LINC)",
                    "Línea de Investigación en Infraestructura (LIIN)"]
                }, 
                
                {
                    title:"PROYECTOS",
                    subitems: [
                    'Simulación 3D del Politecnico JIC con Realidad Virtual y orientada a la Web',
                    'Modelo para la Búsqueda y Recuperación Semántica en Bibliotecas Digitales',
                    'Modelamiento de  un sistema de información geográfico que permita medir el  impacto  del programa en ciclo propedéutico: tecnica profesional en programación en sistemas de información y tecnología en sistematización de datos de la Facultad de Ingenieria del Politecnico Colombiano Jaime Isaza Cadavid',
                    'Sistema Integrado de Informática Agropecuaria “SIIA”',
                    'Diseño de una arquitectura Web para el manejo académico de estudiantes “MACADE”']
                }
                
            ]
        }
        
        return res.status(200).render('home',{investigation:investigation});
    }
}



module.exports = {Paths, UserCtrl, PublicationCtrl, GroupCtrl, lsCtrl };
