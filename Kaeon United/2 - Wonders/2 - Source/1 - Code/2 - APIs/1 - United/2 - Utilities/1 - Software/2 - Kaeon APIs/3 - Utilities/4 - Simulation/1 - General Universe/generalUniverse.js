// [ BEGIN: NOTES ]

/*

	settings: { seed: n. time: n, manual: [] }
	options: { settings, meta: null / { } }
	
	object: { id, type, parent, children, position, properties }

*/

// [ END: NOTES ]

// [ BEGIN: DEPENDENCIES ]

var dimensions = require("kaeon-united")("dimensions");

// [ END: DEPENDENCIES ]

// [ BEGIN: VARAIBLES ]

var childTypes = {
	universe: ["galactic cluster"],
	"galactic cluster": ["galaxy"],
	galaxy: ["star cluster"],
	"star cluster": ["celestial body"],
	"celestial body": ["celestial body"]
}

var categoryType = {
	"celestial body": [
		"star",
		"neutron star",
		"black hole",
		"gas giant",
		"terrestrial planet"
	]
};

// [ END: VARAIBLES ]

// [ BEGIN: HELPER FUNCTIONS ]

function getCosmicEntities(options, parent) {
	
}

// Return: Parent & Children (IDs)
function getEntities(options, id) {

}

// [ END: HELPER FUNCTIONS ]

// Return: IDs
function getLocale(options, position, range) {

}

function getProperties(options, id) {

	let properties = {
		entities: {
			children: [], // STUB - IDs
			parent: 0 // STUB - ID
		},
		absolutePosition: [0, 0, 0],
		relativePosition: [0, 0, 0],
		type: ""
	};

	if(id == 0)
		properties.type == "universe";

	return properties;
}

function getRelativeLocation(options, id, latitude, longitude, distance) {

}

module.exports = {
	getEntities,
	getLocale,
	getProperties,
	getRelativeLocation
};