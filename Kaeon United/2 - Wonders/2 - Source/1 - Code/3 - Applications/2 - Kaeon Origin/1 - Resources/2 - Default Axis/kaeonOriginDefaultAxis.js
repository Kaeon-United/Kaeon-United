var commonCache = use("kaeon-united")("commonCache");
var philosophersStone = use("kaeon-united")("philosophersStone");

module.exports = (options) => {

	options = options != null ? options : { };

	[
		commonCache.commonCache()
	].forEach(item => {
		philosophersStone.connect(philosophersStone.axis, item, [], true);
	});
};