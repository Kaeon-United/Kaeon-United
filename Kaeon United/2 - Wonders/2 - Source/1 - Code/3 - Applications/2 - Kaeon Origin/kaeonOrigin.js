var moduleDependencies = {
	cors: "https://corsproxy.io/?",
	defaultConfig: "https://raw.githubusercontent.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/master/Kaeon%20United/3%20-%20Wonders/2%20-%20Source/1%20-%20Code/3%20-%20Applications/2%20-%20Kaeon%20Origin/1%20-%20Resources/1%20-%20Default%20Config/kaeonOriginDefaultConfig.json",
	icon: "https://raw.githubusercontent.com/Atlas-of-Kaeon/The-Principles-Library-of-Kaeon/master/The%20Principles%20Library%20of%20Kaeon/3%20-%20Wonders/1%20-%20Angaian/2%20-%20Images/2%20-%20Angaian%20Crest/Angaian%20Crest.png"
};

var httpUtils = require("kaeon-united")("httpUtils");
var override = require("kaeon-united")("override");
var vision = require("kaeon-united")("vision");
var virtualSystem = require("kaeon-united")("virtualSystem");

vision.setFavicon(moduleDependencies.icon);

document.title = "Kaeon Origin";

let args = httpUtils.getURLArguments(window.location.href);

virtualSystem.initiateVirtualSystemDefault();

override.onSend((request) => {

	let uri = request.request.uri;

	if(uri.includes(moduleDependencies.cors)) {

		uri = decodeURIComponent(
			uri.substring(moduleDependencies.cors.length).
				split("%2520").join("%20")
		);
	}

	if(uri.startsWith("http") && uri.includes("://"))
		return null;

	uri = decodeURIComponent(uri)
		.split("%2520").join(" ")
		.split("%20").join(" ");

	let mark = "";
	
	try {
		mark = window.terminals[0].getMark();
		mark = mark.substring(0, mark.length - 1).trim();
	}

	catch(error) {
		mark = "";
	}
	
	return virtualSystem.getResource(virtualSystem.getAbsolutePath(uri, mark));
});

virtualSystem.load(
	args.override != "true" ?
		moduleDependencies.defaultConfig :
		null
);

virtualSystem.load(args.config);