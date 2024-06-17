var moduleDependencies = {
	generalInterface: "https://raw.githubusercontent.com/Kaeon-United/Kaeon-United/main/Kaeon%20United/2%20-%20Wonders/2%20-%20Source/1%20-%20Code/1%20-%20Interface/1%20-%20Interfaces/1%20-%20Kaeon%20Core/2%20-%20General%20Interface/kaeonUnitedGeneralInterface.json"
};

var io = require("kaeon-united")("io");

function getUtilities(item, path) {

	path = path != null ? path : "";

	let result = { };

	if(item.components != null) {

		if(item.components.locations != null)
			result[path] = require(item.components.locations[0]);
	}

	if(item.entities != null) {

		Object.keys(item.entities).forEach((key) => {

			Object.assign(
				result,
				getUtilities(
					item.entities[key],
					path + "." + key
				)
			);
		});
	}

	return result;
}

let data = getUtilities(
	JSON.parse(
		io.open(moduleDependencies.generalInterface)
	).use
);

module.exports = (path) => {

	path = path.toLowerCase();

	let keys = Object.keys(data);

	for(let i = 0; i < keys.length; i++) {
		
		if(keys[i].endsWith(path)) {

			let newModule = { };
			
			Object.assign(newModule, data[keys[i]]);

			if(data[keys[i]].methods != null)
				Object.assign(newModule, data[keys[i]].methods);

			return data[keys[i]];
		}
	}

	let newModule = { interfaces: { } };

	Object.values(data).forEach((item) => {

		if(item.interfaces == null)
			return;

		if(item.interfaces[path] == null)
			return;

		newModule.interfaces[item.interfaces[path].name] =
			item.interfaces[path].methods;
	});

	if(Object.values(newModule.interfaces).length != 0)
		Object.assign(newModule, Object.values(newModule.interfaces)[0]);

	return newModule;
};