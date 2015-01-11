var BaseController 	= require("./Base"),
	View 			= require("../views/Base"),
	ReportFile		= require("../report_file"),
	Random 			= require("../random_util");

var defaultFilename = "rasputin_reports.txt";

module.exports = BaseController.extend({ 
	name: "Random Reports",

	run: function(req, res, next) {

		ReportFile.loadReports(defaultFilename, function(err, reports) {
			var index = Random.randomInt(0, reports.length);
			var report = reports[index]; 
			var date = report.day + ' ' + report.month + ' ' + report.year;

			var v = new View(res, "random_report");
			v.render({
				title: "Rasputin's coming and goings",
				date: date, 
				report: report.text
			});
		});

	}
});


