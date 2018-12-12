var path = require('path'),
	fs = require('fs'),
	Model = require('../models'),
	md5 = require('md5'),
	sidebar = require('../helpers/sidebar');

module.exports = {
	index: function(req, res){
		
		var viewModel = {
			image:{},
			comments:[]
		}
		
		Model.Image.findOne({filename:{$regex:req.params.image_id}}, function(err, image){
			if(err){throw err;}
			
			if(image){
				image.views = image.views + 1;
				image.save();
				viewModel.image = image;
				
				Model.Comment.find({image_id:image._id},function(err, comments){
					if(err){throw err;}
					
					viewModel.comments = comments;
					viewModel.user = req.user;
					
					Model.Image.find({views:0},function(err, noviews){
						if(err){throw err;}
						console.log(noviews);

						viewModel.new = noviews.length;
						viewModel.noviews = noviews;

						sidebar(viewModel, function(viewModel){
							res.render('image',viewModel);
						})
					})
				});
			}else{
				res.redirect('/');
			}
		});
	},
	create: function(req, res){
		var saveImage = function(){
			var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
				imgUrl = '';
				
			for(i=0; i<6; i++){
				imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
			}
			
			Model.Image.find({filename:imgUrl}, function(err, images){
				if(err){throw err;}
				
				if(images.length > 0){
					saveImage();
				}else{
					
			var tempPath = req.file.path,
				ext = path.extname(req.file.originalname).toLowerCase();
				targetPath = path.resolve('./public/upload/' + imgUrl + ext);
				
			if(ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif' ){
				fs.rename(tempPath, targetPath, function(err){
					if(err){ throw err;}

					Model.User.findOne({name:req.user.name},function(err, user){

						var newImg = new Model.Image({
							title:req.body.title,
							description:req.body.description,
							filename:imgUrl + ext
						});

						newImg.user_id = user._id;
						
						newImg.save(function(err){
							if(err){throw err;}
							
							res.redirect('/logged');
						});
					
					})
				})
			}else{
				fs.unlink(tempPath, function(err){
					if(err){ throw err;}
					res.status(500).json({Error:'Invalid image format'});
				})
			}
			}	
		})
		}
		saveImage();
	},
	comment:function(req, res){
		Model.Image.findOne({filename:{$regex:req.params.image_id}},function(err, image){
			if(err){throw err;}
			
			if(image){
				var newComment = new Model.Comment(req.body);
				newComment.gravatar = md5(newComment.email);
				newComment.image_id = image._id;
				
				newComment.save(function(err, comment){
					if(err){throw err;}
					
					res.redirect('/image/' + image.uniqueId + '#' + comment._id);
				});
			}else{
				res.redirect('/');
			}
			
		});
	},
	like:function(req, res){
		Model.Image.findOne({filename:{$regex:req.params.image_id}},function(err, image){
			if(!err && image){
				image.likes = image.likes + 1;
				image.save(function(err){
					if(err){
						res.json(err);
					}else{
						res.json({likes: image.likes});
					}
				});
			}else{
				res.redirect('/');
			}
		})
	},
	remove:function(req, res){
		Model.Image.findOne({filename:{$regex:req.params.image_id}}, function(err, image){
			if(err){throw err;}
			
			fs.unlink(path.resolve('./public/upload/' + image.filename), function(err){
				if(err){ throw err;}
					
				Model.Comment.remove({image_id:image._id},function(err){
					if(err){throw err;}	
					
					image.remove(function(err){
						if(err){
							res.json(false);	
						}else{
							res.json(true);
						}
					});
				})
			
		});
	})
}
}