var childProcess = require("child_process");
var http = require("http");
var wifi = require(__dirname + "/wifi.js");

var network = null;
var queue = [];

function execCommand(data) {

	console.log("EXECUTED:", data);

	childProcess.exec(
		"node " + __dirname + "/ghiCommandSocket.js \"" +
		data.data +
		"\"" +
		(
			data.credentials.host != null ?
				" \"" +
				data.credentials.host +
				"\"" +
				(
					data.credentials.port != null ?
						" \"" +
						data.credentials.port +
						"\"" :
					""
				) :
			""
		)
	);
}

http.createServer((request, response) => {
	
	if(!(request.socket.remoteAddress == "::ffff:127.0.0.1" ||
		request.socket.remoteAddress == "::1")) {
	
		response.end();
	
		return;
	}
	
	let url = request.url.substring(1);
	
	if(url == "favicon.ico") {
	
		response.end();
	
		return;
	}
	
	let body = "";
	
	request.on('data', (chunk) => {
		body += chunk.toString();
	}).on('end', () => {
	
		if(body == "TERMINATE") {

			response.end();

			process.exit(0);
		}
	
		let data = { };
	
		try {
			data = JSON.parse(body);
		}
	
		catch(error) {
			data = { };
		}
		
		console.log("INTERCEPTED:", data);

		try {

			if(data.credentials == null) {

				response.end();

				return;
			}

			if(data.credentials.ssid == null) {

				response.end();
				
				return;
			}

			if(data.credentials.ssid != network) {

				network = data.credentials.ssid;

				if(network != null) {

					wifi.connect(data.credentials, () => {

						console.log("CONNECTED:", network);

						execCommand(data);
					});
				}
			}

			else
				execCommand(data);
		}

		catch(error) {
			console.log(error);
		}
	});

	console.log("RETURNED:", queue);
	
	response.write("" + queue);

	queue = [];

	response.end();
}).listen(process.argv[2]);

console.log("READY");