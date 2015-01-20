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

	// setup ADFS auth
	var passport = require('passport')
		, OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

	passport.use(new wsfedsaml2(
				{
					path: '/authenticated',
					realm: 'urn:ppe2codevelocity:azurewebsites',
					homeRealm: '', // optionally specify an identity provider to avoid showing the idp selector
					identityProviderUrl: 'https://corp.sts.microsoft.com/adfs/ls/',
					cert: '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'
				},
				function(profile, done) {
					findByEmail(profile.email, function(err, user) {
						if (err) {
							return done(err);
						}
						return done(null, user);
					});
				})
			));


	// ROUTES FOR OUR API
	// =============================================================================
	var router = express.Router();              // get an instance of the express Router

	router.use(function(req, res, next) {
		log.info({req: req});
		next();
	});

	// ROUTES --------------------------------------------
	router.route("/rasputin/random")
		// render a randomly chosen report
		.get(function(req, res) {
			passport.authenticate('wsfed-saml2', { failureRedirect: '/failure', failureFlash: true }),
			function(req, res) {
				reports.run(req, res);
			}
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
