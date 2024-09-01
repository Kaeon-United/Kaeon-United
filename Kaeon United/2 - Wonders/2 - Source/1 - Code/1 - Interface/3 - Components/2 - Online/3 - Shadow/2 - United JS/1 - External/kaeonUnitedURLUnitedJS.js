function executeJS(code) {
	
	eval(
		"(async () => {" +
		use.ONESuite.preprocess(code) +
		"})()"
	);
}

module.exports = (args, callback) => {

	if(Array.isArray(args)) {

		callback();

		return;
	}

	let arg = args["unitedjs"]

	if(arg == null) {

		callback();

		return;
	}

	executeSingularity();

	executeJS(openResource(args["unitedjs"], true));
};