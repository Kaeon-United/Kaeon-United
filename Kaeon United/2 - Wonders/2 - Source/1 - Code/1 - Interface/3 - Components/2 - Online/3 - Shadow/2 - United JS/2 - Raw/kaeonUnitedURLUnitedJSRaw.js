function executeJS(code) {
	
	eval(
		"(async () => {" +
		require.ONESuite.preprocess(code) +
		"})()"
	);
}

module.exports = (args, callback) => {

	if(Array.isArray(args)) {

		callback();

		return;
	}

	let arg = args["unitedjsraw"]

	if(arg == null) {

		callback();

		return;
	}

	executeSingularity();

	executeJS(args["unitedjsraw"]);
};