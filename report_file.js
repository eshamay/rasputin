var fs 			= require('fs');
var through		= require('through');
var split 		= require('split');

module.exports = {

	// Load and parse all the reports into an array that is passed into the supplied callback
	loadReports: function(filename, callback) {

		filename = filename || defaultFilename;

		fs.exists(filename, function(exists) {
			if (!exists) {
				throw new Error('File "' + filename + '" does not exist');
			}

			var reports = [];
			var report = null

			fs.createReadStream(filename)
			.pipe(split())
			.pipe(through(function write(chunk) {
				var dateRegex = /^([\d]{1,2}) ([^\s]*) ([\d]{4})\. (.*)$/;
				var result = chunk.match(dateRegex);
				if (result) {
					if (report) {
						report.text = report.text.join('\n');
						reports.push(report);
					}

					report = {
						day: result[1],
						month: result[2],
						year: result[3],
						text: []
					};
					report.text.push(result[4]);
				}
				else {
					report.text.push(chunk);
				}

			},
			function end() {
				report.text = report.text.join('\n');
				reports.push(report);
				callback(null, reports);
			}));

		});

	}

};
