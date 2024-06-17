var commonCache = require("kaeon-united")("commonCache");
var philosophersStone = require("kaeon-united")("philosophersStone");

module.exports = (options) => {

	options = options != null ? options : { };

	[
		commonCache.commonCache()
	].forEach(item => {
		philosophersStone.connect(philosophersStone.axis, item, [], true);
	});
};