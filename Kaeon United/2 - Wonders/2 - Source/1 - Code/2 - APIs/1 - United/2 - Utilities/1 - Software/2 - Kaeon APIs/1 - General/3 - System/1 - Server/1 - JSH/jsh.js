var child_process = require("child_process");
var http = require("http");
var fs = require("fs");

var password = null;

var processes = { };
var expiredProcesses = [];
var processID = 0;

function processData(modules, data) {

	let response = { commands: [], modules: [] };

	if(modules != null) {

		modules.forEach((item) => {

			let moduleRequest = null;

			if(data.modules != null) {

				let match = data.modules.filter((value) => {
					return item.name == value.module;
				});

				if(match.length > 0)
					moduleRequest = match[0].request;
			}

			response.modules.push({
				"module": item.name,
				"response": item.process(moduleRequest)
			})
		});
	}

	if(data.commands != null) {

		data.commands.forEach((command) => {

			processes["" + processID] = {
				"command": command.command,
				"location": command.location,
				"log": ""
			};

			let logFunction = (error, stdout, stderr) => {

				if(processes["" + processID] != null && stdout != null)
					processes["" + processID].log += stdout;
			};
			
			processes["" + processID].process = child_process.exec(
				command.command,
				command.location != null ?
					{ cwd: command.location } :
					logFunction,
				command.location != null ?
					logFunction :
					null
			);

			processes["" + processID].process.on('exit', () => {
				expiredProcesses.push["" + processID];
			});

			processes["" + processID].process.stdin.setEncoding('utf-8');

			processID++;
		});
	}

	if(data.processes != null) {

		data.processes.forEach((process) => {

			if(processes[process.id] == null)
				return;

			if(process.terminate)
				processes[process.id].process.kill();

			if(process.input != null)
				processes[process.id].process.stdin.write("" + process.input);
		});
	}

	Object.keys(processes).forEach((key) => {
		
		response.commands.push({
			"command": processes[key].command,
			"id": Number(key),
			"location": processes[key].location,
			"log": processes[key].log
		});

		processes[key].log = "";

		if(expiredProcesses.includes(key)) {

			delete processes[key];

			expiredProcesses.splice(expiredProcesses.indexOf(key), 1);
		}
	})

	return response;
}

function startJSHServer(port, passwordPath, block, modules) {

	if(!fs.existsSync(passwordPath))
		fs.writeFileSync(passwordPath, "null");

	password = JSON.parse(fs.readFileSync(passwordPath, 'utf-8'));

	http.createServer((request, response) => {
	
		if(block && !(
			request.socket.remoteAddress == "::ffff:127.0.0.1" ||
			request.socket.remoteAddress == "::1")) {
		
			response.end();
		
			return;
		}

		try {

			let url = request.url.substring(1);
		
			if(url == "favicon.ico") {
		
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

				let parsedBody = { };
				
				try {
					parsedBody = JSON.parse(body);
				}

				catch(error) {
					parsedBody = { };
				}
				
				if(password == null || password == parsedBody.password) {

					response.write(
						JSON.stringify(processData(modules, parsedBody))
					);

					if(parsedBody.newPassword != null) {

						fs.writeFileSync(
							passwordPath,
							JSON.stringify(parsedBody.newPassword)
						);
					}
				}

				else
					response.write("");
		
				response.end();
			});
		}

		catch(error) {

			console.log(error);

			response.end();
		}
	}).listen(port);
}

module.exports = {
	startJSHServer
};