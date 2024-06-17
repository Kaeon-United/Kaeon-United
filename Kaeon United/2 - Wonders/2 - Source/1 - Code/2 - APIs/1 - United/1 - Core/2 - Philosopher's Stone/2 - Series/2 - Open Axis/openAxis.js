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
			routes: options.routes != null ? options.routes : { },
			standard: (packet) => {

				if(!isHTTPJSON(packet))
					return null;

				["api", "public", "default"].forEach(item => {

					router.routes[item] =
						router.routes[item] != null ?
							router.routes[item] : { };
				});

				let uri = packet.request.uri;
				uri = uri.substring(uri.indexOf("://") + 3);

				if(!uri.includes("/"))
					uri = "/";

				else
					uri = uri.substring(uri.indexOf("/"));

				let route = uri.substring(0, uri.lastIndexOf("/") + 1);
				let file = uri.substring(uri.lastIndexOf("/") + 1);

				if(file.includes("?"))
					file = file.substring(0, file.indexOf("?"));

				if(file == "")
					file = "index.html";

				let directory = router.routes.public[route];
				let isAPI = false;

				if(directory == null) {

					directory = router.routes.api[route];
					
					if(directory == null)
						return null;

					isAPI = true;
				}

				if(!directory.endsWith("/") && !directory.endsWith("\\"))
					directory += "/";

				let filePath = decodeURIComponent(directory + file);

				if(isAPI) {

					if(!filePath.toLowerCase().endsWith(".js"))
						filePath += ".js";

					try {
						return require(filePath)(packet);
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
										${redirect == null ?
											`<pre>${"" + error.stack}</pre>` :
											""
										}
									</body>
								</html>
							`
						};
					}
				}

				if(!fs.existsSync(filePath)) {

					let redirect = (
						route + file == "/index.html" &&
						router.routes.default.index != null
					) ?
						router.routes.default.index :
						router.routes.default.missing;

					return {
						headers: {
							"Content-Type": "text/html"
						},
						body: `
							<!DOCTYPE HTML>
							<html lang="en-US">
								<head>
									${redirect != null ?
										`<meta
											http-equiv="refresh"
											content="0; url=${redirect}"
										/>` :
										""
									}
								</head>
								<body>
									${redirect == null ?
										"<pre>404: Not Found</pre>" :
										""
									}
								</body>
							</html>
						`
					};
				}

				let headers = { };
				let isFile = false;

				let extension = file.includes(".") ?
					file.substring(file.lastIndexOf(".") + 1).toLowerCase() :
					null;

				if(extension != null) {

					if(extensionTypes[extension] != null)
						headers["Content-Type"] = extensionTypes[extension];

					if(fileTypes.includes(extension))
						isFile = true;
				}

				return {
					file: isFile,
					headers: headers,
					body: isFile ?
						filePath :
						ONESuite.preprocess(
							fs.readFileSync(filePath, "utf-8"),
							[packet]
						)
				}
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

			responses.filter(
				item => {

					if(item != null) {

						if(typeof item == "object") {

							if(item.file != null) {
								
								if(item.file)
									file = true;

								delete item.file;
							}
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

						if(error){
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