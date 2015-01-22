(function(){
	"use strict";
	// app.js
	// BASE SETUP
	// =============================================================================

	var log = require("./config/logger");

	log.info("Initializing packages");

	var	path = require("path");

	var express = require("express");        // call express
	var app = express();                 // define our app using express
	var bodyParser = require("body-parser");
	var handlebars = require("express-handlebars").create({defaultLayout: "main", extname: ".hbs"});

	// Controllers
	var reports = require("./controllers/Reports");

	// Configuration
	var config = require("./config/config")();
	log.info("parsed configuration: %s", config.mode);
	app.set("views", path.join(__dirname, "templates"));
	//app.set("view options", { layout: true });
	app.set("view engine", "hbs");
	app.engine("hbs", handlebars.engine);
	app.use(express.static(path.join(__dirname, "public")));

	// configure app to use bodyParser()
	// this will let us get the data from a POST
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	var port = process.env.PORT || config.port || 8080;        // set our port

	// AUTHENTICATION & SSO
	// =============================================================================
	var passport = require('passport');
	var wsfedsaml2 = require('passport-azure-ad').WsfedStrategy;

	app.use(passport.initialize());
	app.use(passport.session());

	var config = {
		realm: 'http://rasputin.azurewebsites.net',
		identityProviderUrl: 'https://login.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47/wsfed',
		identityMetadata: 'https://login.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47/FederationMetadata/2007-06/FederationMetadata.xml',
		logoutUrl:'http://localhost:' + port + '/logout'
	};

	var wsfedStrategy = new wsfedsaml2(config, function(profile, done) {
		if (!profile.email) {
			done(new Error("No email found"));
			return;
		}
		// validate the user here
		log.info('profile');
		console.dir(profile);
		done(null, profile);
	});

	passport.serializeUser(function(user, done) {
		log.info('user');
		console.dir(user);
		done(null, user.email);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			console.dir('deserializeUser: ' + user);
			done(err, user);
		});
	});
	

	passport.use(wsfedStrategy);


	// ROUTES FOR OUR API
	// =============================================================================
	var router = express.Router();              // get an instance of the express Router

	// As with any middleware it is quintessential to call next()
	// if the user is authenticated
	var isAuthenticated = function (req, res, next) {
		if (req.isAuthenticated()) {
			log.info("Already authenticated");
			return next();
		}
		log.info("auth user: " + req.user);
		log.info("not authenticated");
		authenticate(req, res, next);
	}

	var authenticate = function(req, res, next) {
		passport.authenticate('wsfed-saml2', function(err, user, info) {
			if (err) { return next(err); }
			if (!user) { return res.redirect('/login'); }
		})(req, res, next);
	}

	router.use(function(req, res, next) {
		log.info({req: req});
		next();
	});

	router.route("/")
		.get(passport.authenticate('wsfed-saml2'), function(req, res, next) {
			res.send("<h1>user email: " + req.user.email + "</h1>");
		});

	router.route("/authenticated")
		.get(passport.authenticate('wsfed-saml2'), function(req, res, next) {
			log.info("authenticating");
			res.send("<h1>user: " + req.user + "</h1>");
		})
		.post(passport.authenticate('wsfed-saml2'), function(req, res, next) {
			log.info("authenticating");
			res.send("<h1>user: " + req.user.email + "</h1>");
		});

	// ROUTES --------------------------------------------
	router.route("/rasputin/random")
		// render a randomly chosen report
		.get(function(req, res) {
			reports.run(req, res);
		});

	// more routes for our API will happen here

	// REGISTER OUR ROUTES -------------------------------
	// all of our routes will be prefixed with /api
	app.use("/", router);

	// START THE SERVER
	// =============================================================================
	app.listen(port);
	log.info("Magic happens on port " + port);
})();
