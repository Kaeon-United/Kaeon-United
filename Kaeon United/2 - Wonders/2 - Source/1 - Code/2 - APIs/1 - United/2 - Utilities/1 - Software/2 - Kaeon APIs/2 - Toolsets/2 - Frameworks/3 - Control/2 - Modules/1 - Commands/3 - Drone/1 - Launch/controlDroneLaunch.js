var droneIdentifier = require("kaeon-united")("droneIdentifier");

module.exports = (devices, operation, message, state) => {

	if(devices.receptor == null || devices.wifi == null)
		return;

	if(devices.receptor.length == 0 || devices.wifi.length == 0)
		return;

	let receptor = devices.receptor[0];
	let wifi = devices.wifi[0];

	let drone = operation.drone;

	let data = droneIdentifier(drone).utilities.launch(
		receptor,
		wifi,
		drone
	);

	if(message[receptor].metadata == null)
		message[receptor].metadata = { };

	if(message[receptor].metadata.schedule == null)
		message[receptor].metadata.schedule = { };

	if(message[receptor].metadata.schedule.sequences == null)
		message[receptor].metadata.schedule.sequences = [];

	if(message[receptor].metadata.schedule.intervals == null)
		message[receptor].metadata.schedule.intervals = [];

	if(data.sequences != null) {

		message[receptor].metadata.schedule.sequences =
			message[receptor].metadata.schedule.sequences.concat(
				data.sequences
			);
	}

	if(data.intervals != null) {

		message[receptor].metadata.schedule.intervals =
			message[receptor].metadata.schedule.intervals.concat(
				data.intervals
			);
	}
};