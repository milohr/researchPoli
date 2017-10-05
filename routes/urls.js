"use strict"

const controllers = require('../controllers/controllers');
const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();

const ls =  new controllers.lsCtrl();
const path = new controllers.Paths();
const user = new controllers.UserCtrl();
const publication = new controllers.PublicationCtrl();


router.get('/personas/:userEmail?:userId?', path.showPeople);
router.get('/publicaciones/', publication.showPublications);
router.get('/investigacion/', path.showInvestigations);
router.post('/login', ls.signIn);

//private

router.get('/', path.index);
router.get('/dashboard/',auth, path.dashboard);

router.get('/login', ls.login);
router.get('/logout',auth, ls.logout);

router.get('/dashboard/users',auth, user.userDashboard);
router.post('/dashboard/users/actions',auth, user.userAction);
router.post('/dashboard/users/register', user.registerUser);
router.post('/dashboard/users/update',auth, user.updateUser);

router.get('/dashboard/publications',auth, publication.publicationDashboard);
router.post('/dashboard/papers/register',auth, publication.registerPublication);
router.post('/dashboard/papers/actions',auth, publication.publicationAction);
router.post('/dashboard/papers/update',auth, publication.updatePublication);
router.post('/dashboard/papers/remove',auth, publication.removePublication);

router.get('/dashboard/papers/get/:_id?',auth, publication.getPublication);


/*API*/

module.exports = router;
