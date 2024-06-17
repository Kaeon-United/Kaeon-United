var moduleDependencies = {
	cors: "https://corsproxy.io/?"
};

var consoleWidget = require("kaeon-united")("consoleWidget");
var http = require("kaeon-united")("httpUtils");
var io = require("kaeon-united")("io");
var oneSuite = require("kaeon-united")("ONESuite");
var override = require("kaeon-united")("override");
var virtualSystem = require("kaeon-united")("virtualSystem");

virtualSystem.initiateVirtualSystemDefault();

let urlArgs = http.getURLArguments();

let path = urlArgs["path"] != null ? urlArgs["path"] : "";
let content = virtualSystem.getResource(path);

let type = urlArgs["type"];

if(type == null && path.includes("."))
	type = path.substring(path.lastIndexOf(".") + 1);

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
		mark = path.substring(0, path.lastIndexOf("/"));
	}

	catch(error) {
		mark = "";
	}
	
	return virtualSystem.getResource(virtualSystem.getAbsolutePath(uri, mark));
});

if(urlArgs["console"] == "true")
	consoleWidget.createConsole();

if(urlArgs["args"] != "null")
	arguments = JSON.parse(urlArgs["args"]);

if(type == "op" || type == "one")
	oneSuite.process(content);

else if(type == "html") {

	document.documentElement.innerHTML = content;

	let scripts = document.querySelectorAll("script");

	for(let i = 0; i < scripts.length; i++) {

		if(scripts[i].getAttribute("src") != null)
			(1, eval)(io.open(scripts[i].getAttribute("src")));

		(1, eval)(scripts[i].text);
	}
}

else
	eval(content);