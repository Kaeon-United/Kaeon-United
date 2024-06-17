/*

	on call: take core and data string, return string
	on default: take core
	on deserialize: take core, ace, and entity, modify entity
	on entity: take core, entity, and delta
	on serialize: take core and entity, return a ONE list form element or null
	on update: take core and delta

 */

var moduleDependencies = {
	modules: {
		cameraModules: "cameraModules",
		geometryModules: "geometryModules",
		standardModules: "standardModules"
	}
};

var philosophersStone = require("kaeon-united")("philosophersStone");

module.exports = function(core) {

	let modules = [];
	
	Object.values(moduleDependencies.modules).forEach((unit) => {
		modules = modules.concat(require("kaeon-united")(unit));
	});

	for(let i = 0; i < modules.length; i++) {

		modules[i].tags = modules[i].tags ?
			modules[i].tags.concat(["Kaeon ACE"]) :
			["Kaeon ACE"];

		philosophersStone.connect(core, modules[i], [], true);
	}
};