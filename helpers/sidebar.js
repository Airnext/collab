var async = require('async'),
	Stats = require('./stats'),
	Images = require('./images'),
	Comments = require('./comments');

module.exports = function(viewModel, callback){
	async.parallel([
		function(next){
			Stats(next)
		},
		function(next){
			Images.popular(next)
		},
		function(next){
			Comments.newest(next)
		}
	],function(err, results){
		viewModel.sidebar = {
			stats: results[0],
			images: results[1],
			comments: results[2]
		}
		callback(viewModel);
	});
}