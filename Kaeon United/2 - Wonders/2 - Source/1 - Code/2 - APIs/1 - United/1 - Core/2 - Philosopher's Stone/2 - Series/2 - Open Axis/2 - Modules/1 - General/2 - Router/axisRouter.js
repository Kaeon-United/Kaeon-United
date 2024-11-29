var moduleDependencies = {
	kaeonUnitedScript: "https://cdn.jsdelivr.net/gh/kaeon-united/kaeon-united/Kaeon%20United/2%20-%20Wonders/2%20-%20Source/1%20-%20Code/1%20-%20Interface/2%20-%20Singularities/1%20-%20Modules/2%20-%20Library/1%20-%20Frontend/kaeonUnitedSingularityScript.js"
};

var axisUtils = use("axisUtils");
var fs = use("fs");
var ONESuite = use("kaeon-united")("ONESuite");
var path = use("path");
var philosophersStone = use("kaeon-united")("philosophersStone");

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

function axisRouter(options) {

	options = options != null ? options : { };
	
	let router = Object.assign(
		Object.assign({ }, philosophersStone.standard),
		{
			axis: options.axis != null ? options.axis : { },
			middleware: [
				middlewareFile,
				middlewareFolder,
				middlewareJS,
				middlewareText
			].concat(
				options.middleware != null ? options.middleware : []
			),
			standard: (packet) => {

				if(!axisUtils.isHTTPJSON(packet))
					return null;

				let file = axisUtils.getFile(
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

function middlewareFile(packet, file) {
					
	if(!fileTypes.includes(file.type) || file.type == "folder")
		return;

	return {
		headers: {
			"Content-Type": extensionTypes[file.type]
		},
		body: file.file,
		file: true
	}
}

function middlewareFolder(packet, file) {
	
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

function middlewareJS(packet, file) {

	if(file.meta.api != null && file.type == "js") {

		try {

			let response = use(file.file)(packet);

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

					var vision = use("kaeon-united")("vision");

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
}

function middlewareText(packet, file) {
					
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
}

module.exports = {
	extensionTypes,
	fileTypes,
	axisModule: axisRouter,
	axisRouter,
	middlewareFile,
	middlewareFolder,
	middlewareJS,
	middlewareText
};