
module.exports.randomInt = function(min, max) {
	var random = min + Math.floor(Math.random() * max);
	return random;
}
