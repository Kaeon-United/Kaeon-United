module.exports = (devices, operation, message, state) => {

	if(devices.gpio == null)
		return;

	if(devices.gpio.length == 0)
		return;

	let gpio = devices.gpio[0];
	let pin = operation.pin;

	message[gpio] = message[gpio] != null ? message[gpio] : [];

	while(message[gpio].length < pin + 1)
		message[gpio].push(0);

	let flipped = state != null ? message[gpio][pin] == 0 : false;

	message[gpio][pin] = flipped ? 0 : 1;
};