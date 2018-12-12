var express = require('express'),
	app = express(),
	config = require('./server/configure'),
	mongoose = require('mongoose');
	
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');

app = config(app);

mongoose.connect('mongodb://localhost/collab');

app.listen(app.get('port'),function(){
	console.log("Server started at localhost:" + app.get('port'));
});