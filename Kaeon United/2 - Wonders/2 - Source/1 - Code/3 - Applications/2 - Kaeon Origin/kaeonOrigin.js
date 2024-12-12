var moduleDependencies = {
	cors: "https://corsproxy.io/?url=",
	defaultConfig: "https://raw.githubusercontent.com/Kaeon-United/Kaeon-United/main/Kaeon%20United/2%20-%20Wonders/2%20-%20Source/1%20-%20Code/3%20-%20Applications/2%20-%20Kaeon%20Origin/1%20-%20Resources/1%20-%20Default%20Config/kaeonOriginDefaultConfig.json",
	icon: "https://raw.githubusercontent.com/Kaeon-United/Kaeon-United/main/Kaeon%20United/2%20-%20Wonders/2%20-%20Source/2%20-%20Assets/1%20-%20Visual/1%20-%20Images/1%20-%20Iconography/2%20-%20Kaeon%20United/2%20-%20Kaeon%20United/Kaeon%20United%20Logo.png"
};

var httpUtils = use("kaeon-united")("httpUtils");
var override = use("kaeon-united")("override");
var vision = use("kaeon-united")("vision");
var virtualSystem = use("kaeon-united")("virtualSystem");

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