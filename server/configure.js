var express = require('express'),
	routes = require('./routes'),
	path = require('path'),
	exphbs = require('express-handlebars'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	multer = require('multer'),
	errorHandler = require('errorhandler'),
	moment = require('moment'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	passport = require('passport'),
	flash = require('express-flash'),
	expressValidator = require('express-validator'),
	setUpPassport = require('./setuppassport'),
	favicon = require('serve-favicon');

module.exports = function(app){
	app.use(favicon(path.join(__dirname, '../public', 'img', 'favicon.ico')));
	app.use(morgan('dev'));
	app.use(bodyParser.urlencoded({extended:false}));
	app.use(bodyParser.json());
	app.use(expressValidator());
	app.use(multer({'dest':'./public/upload/temp'}).single('file'));
	app.use(cookieParser());
	app.use(session({
		secret:'Tk=v?%R<>s+yK$HwJaz',
		resave:false,
		saveUninitialized:false
	}));
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());
	setUpPassport();
	app.use('/public/', express.static(path.join(__dirname, '../public')));
	routes(app);
	if('development' === app.get('env')){
		app.use(errorHandler());
	}
	app.engine('handlebars', exphbs.create({
		helpers:{
			timeago:function(timestamp){
				return moment(timestamp).startOf('minute').fromNow();
			}
		}
	}).engine);
	app.set('view engine', 'handlebars');
	return app;
}