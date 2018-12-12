var Model = require('../models'),
	sidebar = require('../helpers/sidebar');

module.exports = {
	login: function(req, res){
		var viewModel = {
			images: [],
			indicator:[]
		}
		var count = 0;
		Model.Image.find({},{},{limit:5, sort:{views:-1}},function(err, images){
			if(images){
				for(image in images){
					count++;
					viewModel.indicator.push({title:'image',number:count});
				}
			}
			viewModel.images = images;
			viewModel.signupSuccess = req.flash('signupSuccess');
			viewModel.signupError = req.flash('signupError');
			viewModel.passwordMismatch = req.flash('passwordMismatch');
			viewModel.loginError = req.flash('loginError');
			viewModel.errors = req.session.errors;
			res.render('login_signup', viewModel);
			req.session.errors = null;
		})
	},
	signup: function(req, res){
		req.check('name','Name cannot be empty').notEmpty();
		// req.check('name','Only letters are Allowed for Name').isAlpha();
		req.check('name', 'Only Letters are allowed for Username').matches(/[a-zA-Z]*\s[a-zA-Z]*/).trim().escape();
		req.check('password','Password cannot be empty').notEmpty();
		req.check('password','Password must contain letters and numbers').isAlphanumeric();
		req.check('password','Password should be a least eight characters').isLength({min:8});
		req.check('password','Password Mismatch').equals(req.body.confirmpassword);
		req.check('email','Email cannot be empty').notEmpty();
		req.check('email','Invalid Email Format').isEmail();
		req.check('biography','Biography cannot be empty').notEmpty();
		req.check('biography','Biography should not be more than 50 characters').isLength({max:50});
		
		var errors = req.validationErrors();
		if(errors){
			req.session.errors = errors;
			res.redirect('/');
		}else{
			var email = req.body.email;
				Model.User.findOne({email:email},function(err, user){
					if(err){throw err;}
					if(user){
						req.flash('signupError','User Already Exist!');
						res.redirect('/');
					}else{
						var newUser = Model.User();
						newUser.name = req.body.name;
						newUser.password = newUser.encryptPassword(req.body.password);
						newUser.email = req.body.email;
						newUser.biography = req.body.biography;

						newUser.save(function(err, user){
							if(err){
								throw err;
							}else{
								req.flash('signupSuccess','User Created Successfully');
								res.redirect('/')
							}
						});
					}
				})
		}
	},
	index: function(req, res){
		
		var viewModel = {
			images:[]
		}
		
		Model.Image.find({},{},function(err, images){
			if(err){throw err;}
			
			viewModel.images = images;
			viewModel.user = req.user;

			Model.Image.find({views:0},function(err, noviews){
				if(err){throw err;}
				console.log(noviews);

				viewModel.new = noviews.length;
				viewModel.noviews = noviews;

				sidebar(viewModel, function(viewModel){
					res.render('index',viewModel);
				})
			})
		})
	},
	logout: function(req, res){
		req.logout();
		res.redirect('/');
	}
}