// call the packages we need
var Logger 		= require('bunyan');

module.exports = new Logger({
	name: 'server',
	streams: [{
				stream: process.stdout,
				level: 'debug'
			}],
	serializers: { 
					 req: Logger.stdSerializers.req,
				 }
});

