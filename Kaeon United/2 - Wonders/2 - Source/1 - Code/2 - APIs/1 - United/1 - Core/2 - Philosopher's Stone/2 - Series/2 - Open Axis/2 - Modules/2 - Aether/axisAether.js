var axisUtils = use("kaeon-united")("axisUtils");
var philosophersStone = use("kaeon-united")("philosophersStone");

function axisAether(options) {

	options = options != null ? options : { };
	
	let aether = Object.assign(
		Object.assign({ }, philosophersStone.standard),
		{
			axis: options.axis != null ? options.axis : { },
			standard: (packet) => {

				if(!axisUtils.isHTTPJSON(packet))
					return null;

				// STUB
			},
			tags: ["axis", "aether"]
		}
	);

	// STUB

	return aether;
}

module.exports = {
	axisAether,
	axisModule: axisAether
};