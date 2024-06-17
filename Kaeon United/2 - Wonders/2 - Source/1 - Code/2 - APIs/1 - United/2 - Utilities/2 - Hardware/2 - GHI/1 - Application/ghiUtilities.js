var child_process = require("child_process");
var fs = require("fs");
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

function isEnabled(port) {

	try {

		JSON.parse(
			httpUtils.sendRequest({
				request: {
					method: "POST",
					uri: "http://localhost:" + port
				},
				headers: {
					"Content-Type": "application/json"
				},
				body: ""
			}).body
		);

		return true;
	}

	catch(error) {
		return false;
	}
}

function processClear(port, args) {

	if(fs.existsSync(__dirname + "/dataLog.json"))
		fs.rmSync(__dirname + "/dataLog.json");
}

function processDisable(port, args) {
		
	[port, port + 1, port + 2].forEach((item) => {

		try {

			httpUtils.sendRequest({
				request: {
					method: "POST",
					uri: "http://localhost:" + item
				},
				headers: {
					"Content-Type": "application/json"
				},
				body: "TERMINATE"
			});
		}

		catch(error) {
			
		}
	});
	
	if(process.platform != "win32")
		processDisableLinux();
}

function processDisableLinux() {

	fs.writeFileSync(
		"/var/spool/cron/crontabs/root",
		""
	);
}

function processEnable(port, args) {

	let status = isEnabled(port);

	if(!status) {

		if(process.platform != "win32") {

			child_process.spawn(
				"sudo",
				[
					"/usr/local/bin/node",
					__dirname +
					"/autoVersioner.js",
					"/usr/local/bin/node",
					__dirname + "/ghi.js",
					"" + port
				],
				{
					stdio: 'ignore',
					detached: true,
					shell: false,
					windowsHide: true
				}
			);
		}

		else {

			child_process.spawn(
				"node",
				[
					__dirname +
					"/autoVersioner.js",
					"node",
					__dirname + "/ghi.js",
					"" + port
				],
				{
					stdio: 'ignore',
					detached: true,
					shell: false,
					windowsHide: true
				}
			);
		}
	}
	
	if(process.platform != "win32")
		processEnableLinux(port, status);

	process.exit(0);
}

function processEnableLinux(port, status) {

	fs.writeFileSync(
		"/var/spool/cron/crontabs/root",
		"@reboot sudo /usr/local/bin/node " +
			__dirname +
			"/autoVersioner.js sudo /usr/local/bin/node " +
			__dirname +
			"/ghi.js " +
			port
	);
}

function processInstall(port, args) {

	args.forEach((arg) => {
		child_process.execSync("npm install " + arg);
	});

	fs.writeFileSync(
		"dataPlugins.json",
		JSON.stringify([...new Set(getPluginData().concat(args))])
	);
}

function processList(port, args) {

	getPluginData().forEach((plugin) => {
		console.log(plugin);
	});
}

function processLog(port, args) {

	let log = "";
	
	if(fs.existsSync(__dirname + "/dataLog.json"))
		log = fs.readFileSync(__dirname + "/dataLog.json", 'utf-8');

	if(args.length == 0)
		console.log(log);

	else
		fs.writeFileSync(log, args[0]);
}

function processPlugin(command, port, args) {
	
	getPluginData().forEach((item) => {

		try {
		
			let plugin = require(item);

			if(plugin.verifyCommand(command, port, args))
				plugin.onCommand(command, port, args);
		}

		catch(error) {
			console.log(error);
		}
	});
}

function processPing(port, args) {

	console.log(
		httpUtils.sendRequest({
			request: {
				method: "POST",
				uri: "http://localhost:" + port
			},
			headers: {
				"Content-Type": "application/json"
			},
			body: args[0]
		})
	);
}

function processReset(port, args) {

	if(fs.existsSync(__dirname + "/dataGHI.json"))
		fs.rmSync(__dirname + "/dataGHI.json");

	if(fs.existsSync(__dirname + "/dataJSH.json"))
		fs.rmSync(__dirname + "/dataJSH.json");
}

function processStatus(port, args) {
	console.log(isEnabled(port) ? "On" : "Off");
}

function processUninstall(port, args) {

	args.forEach((arg) => {
		child_process.execSync("npm uninstall " + arg);
	});

	fs.writeFileSync(
		"dataPlugins.json",
		getPluginData().filter((item) => {
			return !args.includes(item);
		})
	);
}

function processCommand(port, args) {

	if(process.argv[2] == "clear")
		processClear(port, args);

	else if(process.argv[2] == "disable")
		processDisable(port, args);

	else if(process.argv[2] == "enable")
		processEnable(port, args);

	else if(process.argv[2] == "install")
		processInstall(port, args);

	else if(process.argv[2] == "list")
		processList(port, args);

	else if(process.argv[2] == "log")
		processLog(port, args);

	else if(process.argv[2] == "ping")
		processPing(port, args);

	else if(process.argv[2] == "reset")
		processReset(port, args);

	else if(process.argv[2] == "status")
		processStatus(port, args);

	else if(process.argv[2] == "uninstall")
		processUninstall(port, args);
	
	else
		processPlugin(process.argv[2], port, args);
}

module.exports = {
	processCommand
};