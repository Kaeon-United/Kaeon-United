var moduleDependencies = {
	tello: {
		launch: "controlDroneLaunch"
	}
};

function generateUtilities(utilities) {

	var result = JSON.parse(JSON.stringify(utilities));
	
	Object.keys(result).forEach((key) => {
		result[key] = require(result[key]);
	});

	return result;
}

module.exports = (drone) => {

	if(drone.startsWith("TELLO-")) {

		return {
			type: "tello",
			utilities: generateUtilities(moduleDependencies.tello)
		};
	}

	return null;
};