"use strict";

/*included modules*/

const express = require('express');
const pug = require('pug');
const parser = require('body-parser');
const session = require('express-session');
const cookie = require('cookie-parser');

/*paths variables*/
const mongoose = require('./models/db');
const viewsDir = `${__dirname}/views`;
const publicDir = express.static(`${__dirname}/public`);
const routes = require('./routes/urls');
const conf = require('./conf');

/* deffs */
// const MongoStore = mongoStoreFactory(session);
const port = process.env.PORT || conf.server.port;
const app = express();

/*set properties*/

app.set('views', viewsDir);
app.set('view engine', 'pug');
app.set('port', port);

app.use(parser.json());
app.use(parser.urlencoded({extended:false}));
app.use(cookie());
app.use( publicDir );

app.locals.moment=require('moment');

app.use(session({
    secret: conf.session.secret,
    resave:true,
    saveUninitialized:true,
    cookie: { path: "/", maxAge: 1800000, httpOnly: true },
//     store: new MongoStore({mongooseConnection: mongoose.connection}),
    name: "user",
    ttl: (4*24*60*60), //session TimeToLive
    
}));
app.use( routes );



module.exports = app;
