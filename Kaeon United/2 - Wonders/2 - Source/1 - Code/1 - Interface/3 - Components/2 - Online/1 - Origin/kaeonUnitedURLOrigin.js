var moduleDependencies = {
	origin: "https://raw.githubusercontent.com/Kaeon-United/Kaeon-United/main/Kaeon%20United/2%20-%20Wonders/2%20-%20Source/1%20-%20Code/3%20-%20Applications/2%20-%20Kaeon%20Origin/kaeonOrigin.js",
};

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

	if(Object.keys(args).length > 0) {

		callback();

		return;
	}

	executeSingularity();
	
	executeJS(openResource(moduleDependencies.origin, true));
};