module.exports = (devices, operation, message, state) => {
	
	if(devices.receptor != null) {
			
		devices.receptor.forEach((item) => {

			message[item] = {
				metadata: { },
				script: ""
			}
		});
	}
	
	if(devices.gpio != null) {
			
		devices.gpio.forEach((item) => {
			message[item] = [];
		});
	}
};