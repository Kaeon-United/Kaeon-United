var serial = require(__dirname + "/serial.js");

var adapters = null;
var deviceState = null;
var devices = null;

function getDevice(ports, item) {

	if(ports == null)
		return null;

	let match = ports.filter((device) => {

		if(typeof item.device == "string")
			return device.pnpId == item.device || device.path == item.device;

		else {

			if(item.device.serial == null &&
				item.device.vendor == null &&
				item.device.product == null) {

				return false;
			}

			if(item.device.serial != null && item.device.serial != device.serialNumber)
				return false;

			if(item.device.vendor != null && item.device.vendor != device.vendorId)
				return false;

			if(item.device.product != null && item.device.product != device.productId)
				return false;

			return true;
		}
	});

	if(match.length == 0)
		return null;
	
	return match[0];
}

function createLink(device) {
			
	try {

		adapters.forEach((adapter) => {

			try {

				if(adapter.verify(device))
					adapter.adapt(device);
			}

			catch(error) {
				console.log(error);
			}
		});

		device.link = serial.connect(
			device.path,
			(data, rawData) => {
				device.response = data;
			}
		);
	}

	catch(error) {

		console.log(error);

		link = { write: () => { } };
	}

	device.init = true;
}

function sendData(ports, data) {

	data.forEach((item) => {

		let device = getDevice(ports, item);

		if(device.init)
			device.init = false;

		if(device == null)
			return;

		if(device.link == null) {

			createLink(device, item.data);

			setTimeout(() => {

				if(device.init)
					device.link.write(serial.getMessage(item.data));
			}, 2000);
		}

		else
			device.link.write(serial.getMessage(item.data));
	});
}

function setPorts(init, callback) {
		
	serial.getPorts((ports) => {

		if(deviceState != JSON.stringify(ports)) {

			deviceState = JSON.stringify(ports);

			if(devices != null) {

				devices.forEach((device) => {
					
					if(device.link != null && device.link.isOpen) {

						device.link.close();

						device.link = null;
						device.init = false;
					}
				});
			}

			if(init) {

				ports.forEach((port) => {
	
					if(port.link == null)
						createLink(port);
				});
			}

			devices = ports;
		}

		if(callback != null)
			callback();
	});
}

module.exports = {
	block: (state, id, call) => {
		return false;
	},
	init: (reference, state, id, callback, args) => {

		adapters = reference.adapters;

		setPorts(true);
	},
	process: (state, id) => {

		let init = deviceState == null;

		if(!init && Array.isArray(state[id].output))
			sendData(devices.slice(0), state[id].output);

		setPorts(false, () => {

			if(init && Array.isArray(state[id].output))
				sendData(devices, state[id].output);
		});
	},
	read: (state, id) => {

		if(devices == null)
			return [];
	
		return devices.map((device) => {

			return {
				id: {
					pnp: device.pnpId,
					path: device.path
				},
				data: device.response
			};
		});
	},
	type: "serial"
};