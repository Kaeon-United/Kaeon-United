module.exports = (devices, operation, message, state) => {

	if(devices.gpio == null)
		return;

	if(devices.gpio.length == 0)
		return;

	let gpio = devices.gpio[0];
	let pins = operation.pins;

	if(devices.serial != null && operation.board != null) {

		if(devices.serial.length == 0)
			return;

		let serial = devices.serial[0];

		message[serial] = message[serial] != null ? message[serial] : [];

		let device = null;

		for(let i = 0; i < message[serial].length; i++) {
			
			if(message[serial][i].device == operation.board) {

				device = message[serial][i];

				break;
			}
		}

		if(device == null) {
				
			device = { device: operation.board, data: [] };

			message[serial].push(device);
		}

		Object.keys(pins).forEach((key) => {
	
			while(device.data.length < key + 1)
				device.data.push(0);
		
			device.data[key] = pins[key];
		});
	}

	else {

		message[gpio] = message[gpio] != null ? message[gpio] : [];

		Object.keys(pins).forEach((key) => {
	
			while(message[gpio].length < key + 1)
				message[gpio].push(0);
		
			message[gpio][key] = pins[key];
		});
	}
};