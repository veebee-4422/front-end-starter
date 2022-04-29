const router = require('express').Router();
const passport = require('passport');
const fetch = require('cross-fetch');
const genPassword = require('../lib/passwordUtils').genPassword;
const database = require('../config/database');
require('dotenv').config();

const connection = database.c1;
const User = connection.models.User;
const Page = connection.models.Page;

// -------------- POST ROUTES ----------------

 router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: '/' }));

 router.post('/register', (req, res, next) => {
    
    const saltHash = genPassword(req.body.password);
    
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt,
        admin: true
    });
    User.findOne({username: newUser.username})
        .then((user)=>{
            if(!user){
                newUser.save()
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(404).render('404');
        });
    
    res.redirect('/login');
 });

// -------------- GET ROUTES ----------------

router.get('/', (req, res, next) => {
    fetch(process.env.API)
        .then(res => res.json())
        .then((page) => {
            if(page){
                if (req.isAuthenticated()) {
                    res.render('main', {page: page});
                } else {
                    res.redirect('/login');
                }
            } else {
                res.status(404).render('404');
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(404).render('404');
        });
    
}) ;
router.get('/login', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('login');
    }
});
router.get('/register', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect('/logout');
    } else {
        res.render('register');
    } 
});
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/login');
});
router.get('/login-failure', (req, res, next) => {
    res.render('login-failure');
});

// ------------------API----------------------

router.get('/api', (req, res, next) => {
    Page.findOne({_id: '6267c4c0aee30a8c692dc690'})
        .then((page)=>{
            if(page){
                page = page.toObject();
                res.json(page);
            } else {
                res.json();
            }
            
        })
        .catch((err)=>{
            console.log(err);
                res.json();
        })
});

module.exports = router;