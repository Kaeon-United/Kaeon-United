function executeOP(code) {
	require.ONESuite.process(code);
}

module.exports = (args, callback) => {

	if(Array.isArray(args)) {

		callback();

		return;
	}

	let arg = args["unitedop"]

	if(arg == null) {

		callback();

		return;
	}

	executeSingularity();

	executeOP(openResource(args["unitedop"], true));
};