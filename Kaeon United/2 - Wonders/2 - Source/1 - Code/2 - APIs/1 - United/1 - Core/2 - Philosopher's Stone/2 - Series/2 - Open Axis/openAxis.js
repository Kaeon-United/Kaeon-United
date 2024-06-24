var moduleDependencies = {
	kaeonUnitedScript: "https://cdn.jsdelivr.net/gh/kaeon-united/kaeon-united/Kaeon%20United/2%20-%20Wonders/2%20-%20Source/1%20-%20Code/1%20-%20Interface/2%20-%20Singularities/1%20-%20Modules/2%20-%20Library/1%20-%20Frontend/kaeonUnitedSingularityScript.js"
};

var fs = require("fs");
var http = require("http");
var https = require("https");
var ONESuite = require("kaeon-united")("ONESuite");
var path = require("path");
var philosophersStone = require("kaeon-united")("philosophersStone");

function axisClock() {
	
	let clock = Object.assign(
		Object.assign({ }, philosophersStone.standard),
		{ tags: ["axis", "clock"] }
	);

	let delta = (new Date()).getTime();

	clock.interval = setInterval(() => {

		philosophersStone.traverse(philosophersStone.axis).forEach(item => {
			
			try {
				item.standard((new Date()).getTime() - delta);
			}

			catch(error) {

			}
		});

		delta = (new Date()).getTime();

	}, 1000 / 60);

	return clock;
}

function axisRouter(options) {

	options = options != null ? options : { };

	let extensionTypes = {
		'txt': 'text/plain',
		'ico': 'image/x-icon',
		'html': 'text/html',
		'js': 'text/javascript',
		'json': 'application/json',
		'css': 'text/css',
		'png': 'image/png',
		'jpg': 'image/jpeg',
		'wav': 'audio/wav',
		'mp3': 'audio/mpeg',
		'svg': 'image/svg+xml',
		'pdf': 'application/pdf',
		'doc': 'application/msword',
		'mp4': 'video/mp4'
	};

	let fileTypes = [
		'ico',
		'png',
		'jpg',
		'wav',
		'mp3',
		'svg',
		'pdf',
		'doc',
		'mp4'
	];
	
	let router = Object.assign(
		Object.assign({ }, philosophersStone.standard),
		{
			axis: options.axis != null ? options.axis : { },
			middleware: [
				(packet, file) => { // JS

					if(file.meta.api != null && file.type == "js") {

						try {

							let response = require(file.file)(packet);

							return response != null ? response : { };
						}

						catch(error) {

							return {
								headers: {
									"Content-Type": "text/html"
								},
								body: `
									<!DOCTYPE HTML>
									<html lang="en-US">
										<head></head>
										<body>
											<pre>${"" + error.stack}</pre>
										</body>
									</html>
								`
							};
						}
					}

					if(file.meta.app != null && file.type == "js") {

						return {
							headers: {
								"Content-Type": "text/html"
							},
							body: `
								<script src="${
									moduleDependencies.kaeonUnitedScript
								}"></script>

								<script>

									${ONESuite.preprocess(
										fs.readFileSync(file.file, "utf-8")
									)}

								</script>
							`
						}
					}

					if(file.meta.app != null && file.type == "json") {

						return {
							headers: {
								"Content-Type": "text/html"
							},
							body: `
								<script src="${
									moduleDependencies.kaeonUnitedScript
								}"></script>

								<script>

									var vision = require("kaeon-united")("vision");

									vision.extend(JSON.parse("${
										JSON.stringify(
											ONESuite.preprocess(
												fs.readFileSync(file.file, "utf-8")
											)
										)
									}");

								</script>
							`
						}
					}
				},
				(packet, file) => { // Text File w/ PUP
					
					if(fileTypes.includes(file.type) || file.type == "folder")
						return;

					return {
						headers: {
							"Content-Type": extensionTypes[file.type]
						},
						body: ONESuite.preprocess(
							fs.readFileSync(file.file, "utf-8")
						)
					}
				},
				(packet, file) => { // File
					
					if(!fileTypes.includes(file.type) || file.type == "folder")
						return;

					return {
						headers: {
							"Content-Type": extensionTypes[file.type]
						},
						body: file.file,
						file: true
					}
				},
				(packet, file) => { // Folder
					
					if(file.type != "folder")
						return;
					
					let result = [[], []];

					fs.readdirSync(file.file).forEach(item => {

						result[
							fs.lstatSync(
								file.file + path.sep + item
							).isDirectory() ? 0 : 1
						].push(item);
					})

					return {
						headers: {
							"Content-Type": "text/json"
						},
						body: JSON.stringify(result, null, "\t")
					}
				}
			].concat(
				options.middleware != null ? options.middleware : []
			),
			standard: (packet) => {

				if(!isHTTPJSON(packet))
					return null;

				let file = getFile(
					packet.request.uri,
					router.axis.directories
				);

				let response = router.middleware.map(
					item => {
						
						try {
							return item(packet, file);
						}

						catch(error) {
							return null;
						}
					}
				).filter(
					item => item != null
				)[0];

				if(response != null)
					return response;

				return {
					response: {
						status: 404
					},
					headers: {
						"Content-Type": "text/html"
					},
					body: `
						<!DOCTYPE HTML>
						<html lang="en-US">
							<head>
								${router.axis.default.missing != null ?
									`<meta
										http-equiv="refresh"
										content="0; url=${
											router.axis.default.missing
										}"
									/>` :
									""
								}
							</head>
							<body>
								${router.axis.default.missing == null ?
									"<pre>404: Not Found</pre>" :
									""
								}
							</body>
						</html>
					`
				};
			},
			tags: ["axis", "router"]
		}
	);

	return router;
}

function axisServer(options) {

	options = options != null ? options : { };
	
	let server = Object.assign(
		Object.assign({ }, philosophersStone.standard),
		{ tags: ["axis", "server"] }
	);

	server.server = http.createServer((request, response) => {

		processRequest(request, "http", (data) => {

			let responses = [];

			philosophersStone.traverse(philosophersStone.axis).forEach(
				item => {
				
					try {
						responses.push(item.standard(data));
					}
		
					catch(error) {
		
					}
				}
			);

			let status = 200;

			let headers = {
				'Content-Type': 'text/plain',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
			};

			let body = [];
			let file = false;

			let max = -Infinity;

			responses.filter(item => item != null).forEach(item => {

				item.priority = item.priority != null ? item.priority : 0;

				if(item.priority > max)
					max = item.priority;
			});

			responses.filter(
				item => {

					if(item == null)
						return

					if(item.priority != max)
						return false;

					delete item.priority;

					if(typeof item == "object") {

						if(item.file != null) {
							
							if(item.file)
								file = true;

							delete item.file;
						}
					}
					
					return isHTTPJSON(item);
				}
			).filter(
				item => item.request == null
			).forEach(item => {

				if(item.response != null) {

					if(item.response.status != null) {

						if(item.response.status > status)
							status = item.response.status;
					}
				}

				if(item.headers != null)
					Object.assign(headers, item.headers);

				if(item.body != null)
					body.push("" + item.body);
			});

			response.writeHead(status, headers);

			if(file) {

				if(body.length > 0) {

					fs.readFile(body[0], function(error, data) {

						if(error) {
							response.statusCode = 500;
							response.end(`ERROR: ${error}.`);
						}
						
						else
							response.end(data);
					});
				}
			}

			else {

				if(body.length == 1)
					response.write(body[0]);
	
				else if(body.length > 1)
					response.write(JSON.stringify(body));
	
				response.end();
			}
		});
	});
	
	server.server.listen(options.port != null ? options.port : 80);

	return server;
}

function getFile(uri, directories) {

	try {

		uri = uri.substring(uri.indexOf("://") + 3);

		if(uri.includes("/"))
			uri = uri.substring(uri.indexOf("/"));

		if(uri.includes("?"))
			uri = uri.substring(0, uri.indexOf("?"));

		return getFiles(
			uri.split("/").filter(item => item.length > 0),
			directories
		).map(file => {

			let type = file.includes(".") ?
				file.substring(file.lastIndexOf(".") + 1) : null;

			let result = {
				file: file,
				folder: fs.lstatSync(file).isDirectory(),
				meta: file.split(/[\/\\]/).map(item =>
					item.split(".").slice(1).reduce(
						(value, item) => {

							item = item.split("-");

							let key = item[0].toLowerCase()

							if(key != type)
								value[key] = item.slice(1).join("-");

							return value;
						},
						{ }
					)
				).reduce((value, item) => Object.assign(value, item), { }),
				type: type
			}

			return result.meta.private == null ? result : null;
		})[0];
	}

	catch(error) {
		return null;
	}
}

function getFiles(items, paths) {

	paths = paths != null ? paths : [];

	let files = [];

	if(items.length > 0) {

		let alias = items[0].split(".")[0];

		paths.forEach(file => {

			try {

				fs.readdirSync(file).forEach(item => {

					if(item.toLowerCase().startsWith(alias.toLowerCase()))
						files.push(file + path.sep + item);
				});
			}

			catch(error) {
				
			}
		});
	}

	if(files.length == 0) {

		paths.forEach(file => {

			try {
		
				fs.readdirSync(file).forEach(item => {
		
					if(item.toLowerCase().startsWith("index"))
						files.push(file + path.sep + item);
				});
			}
	
			catch(error) {
	
			}
		});

		if(files.length == 0)
			return null;
	}

	if(files.length > 1) {

		let match = files.filter(file =>
			file.toLowerCase().endsWith(items[0].toLowerCase())
		);

		files = match.length > 0 ? match : files;
	}

	if(items.length < 2)
		return files;

	return files.map(item =>
		getFiles(items.slice(1), [item])
	).filter(item => item != null).reduce(
		(value, item) => value.concat(item), []
	);
}

function isHTTPJSON(json) {

	if(json == null)
		return false;

	if(typeof json != "object")
		return false;

	let keys = Object.keys(json);
	let fields = ["request", "response", "headers", "body"];

	for(let i = 0; i < keys.length; i++) {

		if(!fields.includes(keys[i]))
			return false;
	}

	if(json.request != null && json.response != null)
		return false;

	if((json.request != null && typeof json.request != "object") ||
		(json.response != null && typeof json.response != "object") ||
		(json.headers != null && typeof json.headers != "object") ||
		(json.body != null && typeof json.body != "string")) {
		
		return false;
	}

	let flag = false;
	fields = ["uri", "method"];

	[
		["request", ["uri", "method", "version"]],
		["response", ["status", "version"]]
	].forEach(item => {

		fields = item[1];
		item = json[item[0]];

		if(item == null)
			return;

		Object.keys(item).forEach(key => {

			if(!fields.includes(key))
				flag = true;

			else if(key == "status" && typeof item[key] != "number")
				flag = true;

			else if(key != "status" && typeof item[key] != "string")
				flag = true;
		});
	});

	if(flag)
		return false;

	let headers = json.headers != null ? Object.values(json.headers) : [];

	for(let i = 0; i < headers.length; i++) {

		if(typeof headers[i] != "string")
			return false;
	}

	return true;
}

function openAxis(options) {

	if(this.active)
		return;

	options = options != null ? options : { };

	[
		axisClock(),
		axisRouter(options),
		axisServer(options)
	].forEach(item => {
		
		philosophersStone.connect(
			philosophersStone.axis,
			item,
			[],
			true
		);
	});

	this.active = true;
}

function processRequest(request, protocol, callback) {

	let text = null;

	request.on('data', (chunk) => {
		text = (text != null ? text : "") + chunk.toString();
	}).on('end', () => {
		callback({
			request: {
				method: request.method,
				uri: protocol +
					"://" +
					request.headers.host +
					request.url
			},
			headers: request.headers,
			body: text
		});
	});
}

module.exports = {
	axisClock,
	axisRouter,
	axisServer,
	isHTTPJSON,
	openAxis,
	processRequest
};