var express = require('express'),
	router = express.Router(),
	index = require('../controllers/index'),
	image = require('../controllers/image'),
	passport = require('passport'),
	isLogged = require('./islogged');
	
module.exports = function(app){
	router.get('/', index.login);
	router.get('/logged', isLogged, index.index);
	router.get('/image/:image_id', isLogged, image.index);
	router.post('/image', image.create);
	router.post('/image/:image_id/comment', image.comment);
	router.post('/image/:image_id/like', image.like);
	router.post('/signup', index.signup);
	router.post('/login', passport.authenticate('local-login',{
		successRedirect:'/logged',
		failureRedirect:'/',
		failureFlash:true
	}));
	router.get('/logout', index.logout);
	router.delete('/image/:image_id', image.remove);
	router.use(function(req, res){
		res.status(404).send('Page Not Found');
	});
	
	app.use(router);
}