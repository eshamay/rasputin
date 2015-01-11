var report 		= require('./report_file');
var random 		= require('./random_util');

var defaultFilename = 'rasputin_reports.txt';

report.loadReports(defaultFilename, function(err, reports) {
	var index = random.randomInt(0, reports.length);
	var report = reports[index]; 
	var date = report.day + ' ' + report.month + ' ' + report.year;
	console.log(date + '\n' + report.text);
});


