var io = use("kaeon-united")("io");
var kaeonACE = use("kaeon-united")("kaeonACECore");
var oneSuite = use("kaeon-united")("oneSuite");
var standardKaeonACE = use("kaeon-united")("standardKaeonACE");
var widgets = use("kaeon-united")("widgets");

function getEnvironment() {

	let environment = "browser";
	
	if(typeof process === 'object') {
	
		if(typeof process.versions === 'object') {
	
			if(typeof process.versions.node !== 'undefined')
				environment = "node";
		}
	}

	return environment;
}

function getPlatform(environment) {

	if(environment == "browser") {

		if(typeof use == "function" && typeof module == "object") {

			if(module.parent != null)
				return "module";
		}

		return "cdn";
	}

	else
		return module.parent != null ? "module" : "cdn";
}

function run(ace, element) {

	element = element != null ? element : document.documentElement;

	var core = { };

	widgets.createStartScreen(() => {

		standardKaeonACE(core);
		
		kaeonACE.run(
			core,
			oneSuite.read(ace),
			element
		);
	}, element);

	return core;
}

if(getPlatform(getEnvironment()) == "cdn") {

	var urlArgs = {};
	
	window.location.href.replace(
		/[?&]+([^=&]+)=([^&]*)/gi,
		function(match, key, value) {
			urlArgs[key.toLowerCase()] = decodeURIComponent(value);
		}
	);

	run(io.open(urlArgs["kaeonace"]));
}

else {

	module.exports = {
		run
	};
}