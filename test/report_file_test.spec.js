var report_file	= require('../report_file');


describe('ReportFile', function(){

	it('should have dates properly set', function(done) {
		report_file.loadReports('test/test_reports.txt', function(err, reports) {
			var report = reports[2];
			expect(report.day).toBe('12');
			expect(report.month).toBe('January');
			expect(report.year).toBe('1915');
			done();
		});
	});

    it('loads all reports', function(done) {
		report_file.loadReports('test/test_reports.txt', function(err, reports) {
			expect(reports.length).toBe(5);
			done();
		});
	});

	it('is read and properly loaded', function(done) {

		report_file.loadReports('test/test_reports.txt', function(err, reports) {
			var report = reports[2];
			expect(/Gavrill Panteleiev Shishkin, with an/.test(report.text)).toBe(true);
			done();
		});

	});

});

