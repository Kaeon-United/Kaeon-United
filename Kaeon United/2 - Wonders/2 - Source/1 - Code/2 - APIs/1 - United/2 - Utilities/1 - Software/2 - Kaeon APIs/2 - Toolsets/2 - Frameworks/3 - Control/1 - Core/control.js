var moduleDependencies = {
	modules: {
		device: {
			raspberryPi: "controlRaspberryPi"
		},
		service: {
			hologram: "controlHologram"
		},
		command: {
			receptorReset: "controlReceptorReset",
			receptorSet: "controlReceptorSet",
			gpioSet: "controlGPIOSet",
			gpioFlip: "controlGPIOFlip",
			gpioFlicker: "controlGPIOFlicker",
			droneLaunch: "controlDroneLaunch"
		}
	},
	scripts: {
		main: "controlMainScript"
	}
};

var io = require("kaeon-united")("io");

var modules = moduleDependencies.modules;
var scripts = moduleDependencies.scripts;

function call(contact, packet, sendCallback, getCallback) {

	sendCall(
		contact.contact,
		getMessage(packet, contact.device, contact.state),
		sendCallback
	);

	return getCalls(contact, null, getCallback);
}

function formatKey(key) {
	return key.split(" ").join("").toLowerCase();
}

function getCalls(contact, cutoff, callback) {

	let service = modules.service[formatKey(contact.service)];

	if(service == null)
		return [];

	try {
		return service.getCalls(contact.credentials, cutoff, callback);
	}

	catch(error) {

		console.log(error.stack);

		return [];
	}
}

function getMessage(packet, device, state) {

	device = device != null ? device : "";

	let devices = modules.device[formatKey(device)] != null ?
		modules.device[formatKey(device)] : 
		{
			receptor: ["0"],
			gpio: ["1"],
			serial: ["2"],
			display: ["3"],
			recorder: ["4"],
			wifi: ["5"],
			bluetooth: ["6"],
			cellular: ["7"]
		};
	
	let receptor = null;

	if(devices["receptor"] != null) {

		receptor = devices["receptor"].length > 0 ?
			devices["receptor"][0] :
			null;
	}
	
	let message = { };

	if(receptor != null)
		message[receptor] = { script: scripts.main };

	packet.forEach((item) => {

		let command = modules.command[formatKey(item.command)];

		if(command != null) {

			let temp = JSON.stringify(message);

			try {
				command(devices, item.operation, message, state);
			}

			catch(error) {

				console.log(error.stack);

				message = JSON.parse(temp);
			}
		}
	});

	return message;
}

function sendCall(contact, message, callback) {

	let service = modules.service[formatKey(contact.service)];

	if(service == null)
		return;

	try {
		return service.sendCall(contact.credentials, message, callback);
	}

	catch(error) {
		console.log(error.stack);
	}
}

Object.keys(scripts).forEach((item) => {
	scripts[item] = io.open(scripts[item]);
});

["command", "device", "service"].forEach((list) => {

	Object.keys(modules[list]).forEach((key) => {

		let path = modules[list][key];

		delete modules[list][key];

		modules[list][formatKey(key)] = require(path);
	});
});

module.exports = {
	call,
	getCalls,
	getMessage,
	scripts,
	sendCall
};