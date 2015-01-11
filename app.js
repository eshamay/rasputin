// app.js

// BASE SETUP
// =============================================================================

// call the packages we need
var Logger 		= require('bunyan');
var log 		= new Logger({
  name: 'server',
  streams: [
    {
      stream: process.stdout,
      level: 'debug'
    },
  ],
	serializers: { 
		req: Logger.stdSerializers.req,
	}
});

log.info('Initializing packages');

var	http 		= require('http'),
	path 		= require('path');

var express    = require('express'),        // call express
	app        = express(),                 // define our app using express
	bodyParser = require('body-parser');

// Controllers
var Reports		= require('./controllers/Reports');


// Configuration
var config = require('./config/config')();
log.info('parsed configuration: %s', config.mode);
app.set('views', path.join(__dirname, 'templates'));
app.set('view options', { layout: true });
app.set('view engine', 'hbs');
app.engine('.hbs', require('consolidate').handlebars);
app.use(express.static(path.join(__dirname, 'public')));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || config.port || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.use(function(req, res, next) {
	log.info({req: req});
	next();
});

// on routes that end in /bears
// ----------------------------------------------------
router.route('/rasputin/random')
	// render a randomly chosen report
    .get(function(req, res) {
		Reports.run(req, res);
    });


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.render('rasputin_report', { title: 'some title' } );
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
log.info('Magic happens on port ' + port);

