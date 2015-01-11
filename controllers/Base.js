var _ = require('underscore');

module.exports = {
	name: "base",
	extend: function(properties) {
		return _.extend({}, this, properties);
	},
	run: function(req, res, next) { }
}

