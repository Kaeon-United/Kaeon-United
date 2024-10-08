var moduleDependencies = {
	defaultConfig: "https://raw.githubusercontent.com/Kaeon-United/Kaeon-United/main/Kaeon%20United/2%20-%20Wonders/2%20-%20Source/1%20-%20Code/3%20-%20Applications/2%20-%20Kaeon%20Origin/1%20-%20Resources/1%20-%20Default%20Config/kaeonOriginDefaultConfig.json",
};

var io = use("kaeon-united")("io");
var virtualSystem = use("kaeon-united")("virtualSystem");

function kaeonMETA(command) {

	if(window.fileSystem == null) {

		virtualSystem.initiateVirtualSystemDefault();

		let config = JSON.parse(io.open(moduleDependencies.defaultConfig));
		config.commands = [];

		virtualSystem.load(config);
	}

	try {
		
		return virtualSystem.executeCommand(
			"Storage://User/Applications/Processes/meta " +
				JSON.stringify(command)
		)[0];
	}

	catch(error) {
		return null;
	}
}

module.exports = {
	kaeonMETA
};