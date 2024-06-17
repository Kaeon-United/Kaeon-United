var moduleDependencies = {
	kaeonUnited: "https://cdn.jsdelivr.net/gh/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io@master/Kaeon%20United/2%20-%20Wonders/1%20-%20United/2%20-%20Source/1%20-%20APIs/3%20-%20United/2%20-%20Source/KaeonUnited.js"
};

var fs = require("fs");
var http = require("http");
var ghiReference = require(__dirname + "/ghiReference.js");
var httpUtils = require(__dirname + "/httpUtils.js");

function getPluginData() {

	if(!fs.existsSync("dataPlugins.json"))
		fs.writeFileSync("dataPlugins.json", "[]");

	try {
		return JSON.parse(fs.readFileSync("dataPlugins.json", "utf-8"));
	}

	catch(error) {
		return [];
	}
}

function init() {

	Object.keys(ghiReference.devices).forEach((key) => {

		state[key] = {
			output: { },
			input: { },
			type: ghiReference.devices[key].type
		};
	});

	Object.keys(ghiReference.devices).forEach((key) => {

		ghiReference.devices[key].init(
			ghiReference,
			state,
			key,
			processCall,
			process.argv
		);
	});

	ghiReference.processes.forEach((item) => {

		try {
			item.initialize(state);
		}

		catch(error) {
			console.log(error);
		}

		setInterval(
			() => {

				try {
					item.update(state);
				}

				catch(error) {
					console.log(error);
				}
			},
			item.rate * 1000
		);
	});

	setInterval(
		() => {

			let data = getPluginData();
			
			if(JSON.stringify(Object.keys(plugins)) !=
				JSON.stringify(data)) {
				
				plugins = { };

				data.forEach((item) => {

					try {

						plugins[item] = require(item);

						if(!plugins[item].initialized &&
							plugins[item].initialize != null) {

							plugins[item].initialize(state);

							plugins[item].initialized = true;
						}
					}

					catch(error) {

						console.log(error);

						plugins[item] = { };
					}
				});
			}
		},
		1000
	);

	setInterval(
		() => {

			Object.values(plugins).forEach((item) => {

				try {

					if(item.onUpdate != null)
						item.onUpdate(state);
				}

				catch(error) {
					console.log(error);
				}
			});
		},
		1000 / 60
	);
}

function processCall(call) {

	Object.keys(call).forEach((key) => {

		try {
			state[key].output = call[key];
		}
	
		catch(error) {
			console.log(error);
		}
	});

	Object.keys(call).forEach((key) => {

		try {
			ghiReference.devices[key].process(state, key);
		}
	
		catch(error) {
			console.log(error);
		}
	});

	Object.keys(state).forEach((key) => {

		try {
			state[key].input = ghiReference.devices[key].read(state, key);
		}
	
		catch(error) {
			console.log(error);
		}
	});
}

function processRequest(data) {

	try {

		let validated = validate(data);

		console.log(validated ? "VALIDATED" : "INVALIDATED");

		if(validated) {

			processCall(data);

			return state;
		}

		else
			return null;
	}

	catch(error) {
		console.log(error);
	}

	return null;
}

function validate(call) {

	let keys = Object.keys(ghiReference.devices);

	for(let i = 0; i < keys.length; i++) {

		try {

			if(ghiReference.devices[keys[i]].block(state, keys[i], call))
				return false;
		}
	
		catch(error) {
			console.log(error);
		}
	}

	return true;
}

var plugins = { };
var state = { };

init();

http.createServer((request, response) => {

	let url = request.url.substring(1);

	if(url == "favicon.ico") {

		response.end();

		return;
	}

	if(request.method == "GET") {

		response.setHeader("Content-Type", "text/html");

		let site = "<script src=\"" +
			moduleDependencies.kaeonUnited +
			"\"></script>" +
			"<script>" +
			fs.readFileSync(__dirname + "/ghiSite.js", "utf-8") +
			"</script>";

		Object.values(plugins).forEach((item) => {

			try {

				if(item.onSite != null)
					site = item.onSite(state, site);
			}

			catch(error) {
				console.log(error);
			}
		});

		response.write(site);

		response.end();

		return;
	}

	let body = "";

	request.on('data', (chunk) => {
		body += chunk.toString();
	}).on('end', () => {
	
		if(body == "TERMINATE" && (
			request.socket.remoteAddress == "::ffff:127.0.0.1" ||
			request.socket.remoteAddress == "::1")) {

			response.end();

			process.exit(0);
		}

		console.log("RECEIVED:", body);

		let data = { };
		let result = { };

		try {
			data = JSON.parse(body);
		}

		catch(error) {

			console.log(error);

			data = { };
		}

		console.log("PROCESSED:", data);

		Object.values(plugins).forEach((item) => {

			try {

				if(item.onIncoming != null)
					item.onIncoming(state, data);
			}

			catch(error) {
				console.log(error);
			}
		});

		if(Object.keys(data).includes("commands") ||
			Object.keys(data).includes("processes") ||
			Object.keys(data).includes("modules") ||
			Object.keys(data).includes("password") ||
			Object.keys(data).includes("newPassword")) {

			try {

				let jshResponse = JSON.parse(
					httpUtils.sendRequest(
						{
							request: {
								method: "POST",
								uri: "http://localhost:" + process.argv[4]
							},
							body: body
						}
					).body
				);

				if(data.modules != null) {

					let match = data.modules.filter((item) => {
						return item.module == "ghi";
					});

					if(match.length > 0) {

						try {
							
							jshResponse.modules.push({
								module: "ghi",
								response: processRequest(match[0].request)
							});
						}

						catch(error) {
							console.log(error);
						}
					}
				}

				result = jshResponse;
			}

			catch(error) {
				console.log(error);
			}
		}

		else
			result = processRequest(data);

		Object.values(plugins).forEach((item) => {

			try {

				if(item.onOutgoing != null)
					item.onOutgoing(state, data, result);
			}

			catch(error) {
				console.log(error);
			}
		});

		try {
			response.write(JSON.stringify(result));
		}

		catch(error) {
			response.write("{}");
		}

		response.end();
	});
}).listen(process.argv[2]);

console.log("READY");