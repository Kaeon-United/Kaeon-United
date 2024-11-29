var axisUtils = use("kaeon-united")("axisUtils");
var fs = use("fs");
var http = use("http");
var https = use("https");
var philosophersStone = use("kaeon-united")("philosophersStone");

function axisServer(options) {

	options = options != null ? options : { };
	
	let server = Object.assign(
		Object.assign({ }, philosophersStone.standard),
		{ tags: ["axis", "server"] }
	);

	server.server = http.createServer((request, response) => {

		axisUtils.processRequest(request, "http", (data) => {

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
					
					return axisUtils.isHTTPJSON(item);
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

module.exports = {
	axisModule: axisServer,
	axisServer
};