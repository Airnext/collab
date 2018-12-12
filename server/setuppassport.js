var passport = require('passport'),
	localStrategy = require('passport-local').Strategy,
	User = require('../models').User;

module.exports = function(){
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});
	
	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(null, user);
		})
	});
	
	passport.use('local-login', new localStrategy({
			usernameField:'email',
			passwordField:'password',
			passReqToCallback:true
		},function(req, email, password, done){
			User.findOne({email:email},function(err, user){
				if(err){return done(err);}
				
				if(!user){
					req.flash('loginError','Email or Password Incorrect');
					return done(null, false);
				}
				
				if(!user.checkPassword(password)){
					req.flash('loginError','Email or Password Incorrect');
					return done(null, false);
				}
				
				return done(null, user);
			})
		})
	);
}