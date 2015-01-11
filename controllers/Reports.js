var BaseController 	= require("./Base"),
	View 			= require("../views/Base");

module.exports = BaseController.extend({ 
	name: "Random Reports",

	run: function(req, res, next) {
		var v = new View(res, 'random_report');
		v.render({title: 'title shmitle'});
	}
});


